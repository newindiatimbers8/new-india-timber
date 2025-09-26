"""
Utility functions for image processing and file operations
"""

import os
import uuid
from pathlib import Path
from typing import Optional
import PIL.Image
from io import BytesIO

def save_image(image_data: bytes, filename: Optional[str] = None, output_dir: Optional[str] = None) -> str:
    """Save image data to file
    
    Args:
        image_data: Raw image data as bytes
        filename: Optional filename (will generate UUID if not provided)
        output_dir: Optional output directory (will use environment variable if not provided)
        
    Returns:
        Path to saved image file
    """
    
    # Get output directory
    if output_dir is None:
        output_dir = os.environ.get("OUTPUT_IMAGE_PATH", "generated-images")
    
    # Create output directory if it doesn't exist
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Generate filename if not provided
    if filename is None:
        filename = f"generated_image_{uuid.uuid4().hex[:8]}.png"
    
    # Ensure filename has extension
    if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        filename += '.png'
    
    # Save the image
    file_path = output_path / filename
    with open(file_path, 'wb') as f:
        f.write(image_data)
    
    return str(file_path)

def validate_image_data(image_data: bytes) -> bool:
    """Validate that the image data is a valid image
    
    Args:
        image_data: Raw image data as bytes
        
    Returns:
        True if valid image, False otherwise
    """
    try:
        with BytesIO(image_data) as img_buffer:
            PIL.Image.open(img_buffer)
        return True
    except Exception:
        return False

def resize_image(image_data: bytes, max_size: tuple = (1024, 1024)) -> bytes:
    """Resize image data while maintaining aspect ratio
    
    Args:
        image_data: Raw image data as bytes
        max_size: Maximum size as (width, height) tuple
        
    Returns:
        Resized image data as bytes
    """
    try:
        with BytesIO(image_data) as img_buffer:
            img = PIL.Image.open(img_buffer)
            img.thumbnail(max_size, PIL.Image.Resampling.LANCZOS)
            
            output_buffer = BytesIO()
            img.save(output_buffer, format='PNG')
            return output_buffer.getvalue()
    except Exception as e:
        # If resize fails, return original data
        return image_data
