#!/usr/bin/env python3
"""
Test script to generate one image using the KIE.ai API
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the src directory to Python path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

from kie_client import get_kie_client

async def test_image_generation():
    """Test generating one image with KIE.ai API"""
    
    # Check if API key is set
    if not os.environ.get("KIE_API_KEY"):
        print("❌ KIE_API_KEY environment variable not set!")
        print("Please set your KIE.ai API key:")
        print("export KIE_API_KEY='your_api_key_here'")
        return False
    
    try:
        print("🚀 Starting image generation test...")
        
        # Get the client
        client = get_kie_client()
        print("✅ KIE.ai client initialized")
        
        # Test prompt for a timber product
        prompt = """Professional product photography of premium Burma Teak wood door in a modern Indian timber workshop setting. 
        The door should showcase rich golden-brown teak grain patterns, smooth finish, and premium craftsmanship. 
        Include subtle workshop lighting, wood shavings, and timber tools in the background. 
        High quality, commercial photography style, warm lighting, 16:9 aspect ratio, PNG format."""
        
        print(f"📝 Generating image with prompt: {prompt[:100]}...")
        
        # Generate the image
        image_data, image_url = await client.generate_image(
            prompt=prompt,
            output_format="png",
            image_size="16:9"
        )
        
        print(f"✅ Image generated successfully!")
        print(f"📊 Image size: {len(image_data)} bytes")
        print(f"🔗 Image URL: {image_url}")
        
        # Save the image
        output_dir = Path(__file__).parent.parent / "generated-images"
        output_dir.mkdir(exist_ok=True)
        
        output_file = output_dir / "test_timber_door.png"
        with open(output_file, "wb") as f:
            f.write(image_data)
        
        print(f"💾 Image saved to: {output_file}")
        return True
        
    except Exception as e:
        print(f"❌ Error generating image: {str(e)}")
        return False

if __name__ == "__main__":
    # Run the test
    success = asyncio.run(test_image_generation())
    if success:
        print("\n🎉 Image generation test completed successfully!")
    else:
        print("\n💥 Image generation test failed!")
        sys.exit(1)
