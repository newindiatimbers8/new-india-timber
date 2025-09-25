import asyncio
import logging
import os
import time
from typing import Dict, List, Optional, Tuple, Any
import aiohttp
import json

logger = logging.getLogger(__name__)


class KIEAPIClient:
    """Client for KIE.ai Nano Banana API with task-based workflow support."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the KIE.ai API client.
        
        Args:
            api_key: KIE.ai API key. If not provided, will try to get from environment.
        """
        self.api_key = api_key or os.environ.get("KIE_API_KEY")
        if not self.api_key:
            raise ValueError("KIE_API_KEY environment variable not set")
        
        self.base_url = "https://api.kie.ai/api/v1"
        # Correct endpoints based on official documentation
        self.create_task_endpoint = "/jobs/createTask"
        self.query_task_endpoint = "/jobs/recordInfo"
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        # Default parameters
        self.default_params = {
            "output_format": "png",
            "image_size": "auto"
        }
    
    async def _test_endpoints(self) -> bool:
        """Test if the API endpoints are accessible."""
        # Simple test payload based on the documentation
        test_payload = {
            "model": "google/nano-banana",
            "input": {
                "prompt": "test",
                "output_format": "png",
                "image_size": "auto"
            }
        }
        
        async with aiohttp.ClientSession() as session:
            try:
                url = f"{self.base_url}{self.create_task_endpoint}"
                async with session.post(url, headers=self.headers, json=test_payload) as response:
                    # We expect either 200 (success) or 400 (bad request due to test prompt)
                    if response.status in [200, 400]:
                        logger.info(f"API endpoint accessible: {url} (status: {response.status})")
                        return True
                    else:
                        logger.warning(f"API endpoint returned unexpected status: {response.status}")
                        return False
            except Exception as e:
                logger.error(f"API endpoint test failed: {str(e)}")
                return False
    
    async def create_task(self, 
                         prompt: str, 
                         model: str = "google/nano-banana",
                         image_urls: Optional[List[str]] = None,
                         output_format: str = "png",
                         image_size: str = "auto") -> str:
        """Create a new image generation task.
        
        Args:
            prompt: Text description for generation/editing
            model: Model to use ("google/nano-banana" or "google/nano-banana-edit")
            image_urls: List of image URLs for editing (required for edit model)
            output_format: Output format ("png" or "jpeg")
            image_size: Image size ("auto", "1:1", "3:4", "9:16", "4:3", "16:9")
            
        Returns:
            Task ID for the created task
            
        Raises:
            Exception: If task creation fails
        """
        # Build payload according to the official API documentation
        payload = {
            "model": model,
            "input": {
                "prompt": prompt,
                "output_format": output_format,
                "image_size": image_size
            }
        }
        
        # Note: Image editing is not supported in the current API documentation
        # The API only supports text-to-image generation
        if image_urls:
            logger.warning("Image editing is not supported in the current KIE.ai API. Using text-to-image generation only.")
        
        async with aiohttp.ClientSession() as session:
            try:
                url = f"{self.base_url}{self.create_task_endpoint}"
                async with session.post(url, headers=self.headers, json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        if result.get("code") == 200:
                            task_id = result.get("data", {}).get("taskId")
                            if not task_id:
                                raise Exception("No taskId returned from API")
                            
                            logger.info(f"Created KIE.ai task: {task_id}")
                            return task_id
                        else:
                            error_msg = result.get("msg", "Unknown error")
                            raise Exception(f"API error: {error_msg}")
                    else:
                        error_text = await response.text()
                        raise Exception(f"Failed to create task: {response.status} - {error_text}")
                    
            except aiohttp.ClientError as e:
                logger.error(f"Network error creating task: {str(e)}")
                raise Exception(f"Network error: {str(e)}")
    
    async def get_task_status(self, task_id: str) -> Dict[str, Any]:
        """Get the status of a task.
        
        Args:
            task_id: The task ID to check
            
        Returns:
            Dictionary containing task status and result (if completed)
            
        Raises:
            Exception: If status check fails
        """
        async with aiohttp.ClientSession() as session:
            try:
                url = f"{self.base_url}{self.query_task_endpoint}?taskId={task_id}"
                async with session.get(url, headers=self.headers) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise Exception(f"Failed to get task status: {response.status} - {error_text}")
                    
                    result = await response.json()
                    if result.get("code") == 200:
                        task_data = result.get("data", {})
                        logger.debug(f"Task {task_id} status: {task_data.get('state')}")
                        return task_data
                    else:
                        error_msg = result.get("msg", "Unknown error")
                        raise Exception(f"API error: {error_msg}")
                    
            except aiohttp.ClientError as e:
                logger.error(f"Network error getting task status: {str(e)}")
                raise Exception(f"Network error: {str(e)}")
    
    async def wait_for_completion(self, 
                                 task_id: str, 
                                 max_wait_time: int = 120,
                                 poll_interval: float = 2.0) -> Dict[str, Any]:
        """Wait for a task to complete and return the result.
        
        Args:
            task_id: The task ID to wait for
            max_wait_time: Maximum time to wait in seconds
            poll_interval: Time between status checks in seconds
            
        Returns:
            Final task result with images
            
        Raises:
            Exception: If task fails or times out
        """
        start_time = time.time()
        
        while time.time() - start_time < max_wait_time:
            status_result = await self.get_task_status(task_id)
            state = status_result.get("state")
            
            if state == "success":
                logger.info(f"Task {task_id} completed successfully")
                return status_result
            elif state == "fail":
                fail_msg = status_result.get("failMsg", "Unknown error")
                raise Exception(f"Task {task_id} failed: {fail_msg}")
            elif state in ["waiting"]:
                logger.debug(f"Task {task_id} still processing (state: {state})")
                await asyncio.sleep(poll_interval)
            else:
                logger.warning(f"Unknown task state: {state}")
                await asyncio.sleep(poll_interval)
        
        raise Exception(f"Task {task_id} timed out after {max_wait_time} seconds")
    
    async def generate_image(self, 
                           prompt: str,
                           output_format: str = "png",
                           image_size: str = "auto") -> Tuple[bytes, str]:
        """Generate an image from text prompt.
        
        Args:
            prompt: Text description of the image to generate
            output_format: Output format ("png" or "jpeg")
            image_size: Image size ("auto", "1:1", "3:4", "9:16", "4:3", "16:9")
            
        Returns:
            Tuple of (image_data, image_url)
            
        Raises:
            Exception: If generation fails
        """
        # Create task
        task_id = await self.create_task(
            prompt=prompt,
            model="google/nano-banana",
            output_format=output_format,
            image_size=image_size
        )
        
        # Wait for completion
        result = await self.wait_for_completion(task_id)
        
        # Extract image data from resultJson
        result_json_str = result.get("resultJson")
        if not result_json_str:
            raise Exception("No resultJson returned from KIE.ai API")
        
        import json
        try:
            result_json = json.loads(result_json_str)
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse resultJson: {str(e)}")
        
        result_urls = result_json.get("resultUrls", [])
        if not result_urls:
            raise Exception("No resultUrls in resultJson")
        
        image_url = result_urls[0]  # Get first image URL
        
        # Download image data
        async with aiohttp.ClientSession() as session:
            async with session.get(image_url) as response:
                if response.status != 200:
                    raise Exception(f"Failed to download image: {response.status}")
                
                image_data = await response.read()
                logger.info(f"Downloaded image from KIE.ai: {len(image_data)} bytes")
                
                return image_data, image_url
    
    async def edit_image(self, 
                        prompt: str,
                        image_urls: List[str],
                        output_format: str = "png",
                        image_size: str = "auto") -> Tuple[bytes, str]:
        """Edit an image based on text prompt.
        
        Note: The current KIE.ai API only supports text-to-image generation, not image editing.
        This method will raise an exception to inform users about this limitation.
        
        Args:
            prompt: Text description of the edits to make
            image_urls: List of image URLs to edit
            output_format: Output format ("png" or "jpeg")
            image_size: Image size ("auto", "1:1", "3:4", "9:16", "4:3", "16:9")
            
        Returns:
            Tuple of (image_data, image_url)
            
        Raises:
            Exception: Always raises an exception since image editing is not supported
        """
        raise NotImplementedError(
            "Image editing is not supported in the current KIE.ai API. "
            "The API only supports text-to-image generation. "
            "Please use the generate_image method instead."
        )


# Global client instance
_kie_client: Optional[KIEAPIClient] = None


def get_kie_client() -> KIEAPIClient:
    """Get or create the global KIE.ai client instance.
    
    Returns:
        KIEAPIClient instance
        
    Raises:
        ValueError: If KIE_API_KEY is not configured
    """
    global _kie_client
    if _kie_client is None:
        _kie_client = KIEAPIClient()
    return _kie_client
