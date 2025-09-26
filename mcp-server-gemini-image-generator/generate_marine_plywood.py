#!/usr/bin/env python3
"""
Generate AI image for Marine Plywood 19mm product
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the src directory to Python path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

from mcp_server_gemini_image_generator.kie_client import get_kie_client
from mcp_server_gemini_image_generator.utils import save_image

async def generate_marine_plywood_image():
    """Generate AI image for Marine Plywood 19mm"""
    
    print("🪵 Marine Plywood 19mm Image Generator")
    print("=" * 50)
    
    # Check API key
    if not os.environ.get("KIE_API_KEY"):
        print("❌ KIE_API_KEY not set!")
        return False
    
    try:
        print("🚀 Starting image generation...")
        
        client = get_kie_client()
        
        prompt = "Professional product photography of premium Marine Plywood 19mm sheets, waterproof BWP grade, clean workshop background, high resolution, commercial quality"
        print(f"📝 Generating image for prompt: '{prompt}'")
        
        image_data, image_url = await client.generate_image(
            prompt=prompt,
            output_format="png",
            image_size="16:9"
        )
        
        # Save the image
        output_dir = Path(__file__).parent / "generated-images"
        output_dir.mkdir(exist_ok=True)
        
        filename = f"marine_plywood_19mm.png"
        file_path = save_image(image_data, filename=filename, output_dir=str(output_dir))
        
        print(f"✅ Image generated and saved to: {file_path}")
        print(f"🔗 Original image URL: {image_url}")
        print(f"📊 Image size: {len(image_data)} bytes")
        
        return True
        
    except Exception as e:
        print(f"❌ Error generating image: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(generate_marine_plywood_image())
