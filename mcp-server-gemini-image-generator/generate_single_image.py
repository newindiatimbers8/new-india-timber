#!/usr/bin/env python3
"""
Script to generate a single image using the KIE.ai API
This demonstrates the complete setup and usage process.
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the src directory to Python path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

def check_setup():
    """Check if the setup is complete"""
    print("🔍 Checking setup...")
    
    # Check API keys
    kie_key = os.environ.get("KIE_API_KEY")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    
    print(f"KIE_API_KEY: {'✅ Set' if kie_key else '❌ Not set'}")
    print(f"GEMINI_API_KEY: {'✅ Set' if gemini_key else '❌ Not set'}")
    
    if not kie_key:
        print("\n❌ KIE_API_KEY is required!")
        print("To get a KIE.ai API key:")
        print("1. Visit: https://kie.ai/")
        print("2. Sign up for an account")
        print("3. Get your API key from the dashboard")
        print("4. Set it: export KIE_API_KEY='your_api_key_here'")
        return False
    
    return True

async def generate_timber_door_image():
    """Generate a single image of a timber door"""
    
    if not check_setup():
        return False
    
    try:
        from mcp_server_gemini_image_generator.kie_client import get_kie_client
        
        print("\n🚀 Starting image generation...")
        
        # Get the client
        client = get_kie_client()
        print("✅ KIE.ai client initialized")
        
        # Create a detailed prompt for a timber door
        prompt = """Professional product photography of premium Burma Teak wood door in a modern Indian timber workshop setting. 
        The door should showcase rich golden-brown teak grain patterns, smooth finish, and premium craftsmanship. 
        Include subtle workshop lighting, wood shavings, and timber tools in the background. 
        High quality, commercial photography style, warm lighting, 16:9 aspect ratio, PNG format."""
        
        print(f"📝 Generating image...")
        print(f"Prompt: {prompt[:100]}...")
        
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
        
        output_file = output_dir / "burma_teak_door.png"
        with open(output_file, "wb") as f:
            f.write(image_data)
        
        print(f"💾 Image saved to: {output_file}")
        print(f"📁 Full path: {output_file.absolute()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error generating image: {str(e)}")
        print("\n🔧 Troubleshooting:")
        print("1. Check your KIE_API_KEY is valid")
        print("2. Ensure you have internet connection")
        print("3. Check KIE.ai service status")
        return False

def main():
    """Main function"""
    print("🪵 Timber Door Image Generator")
    print("=" * 40)
    
    # Run the generation
    success = asyncio.run(generate_timber_door_image())
    
    if success:
        print("\n🎉 Image generation completed successfully!")
        print("You can now use this image in your products page.")
    else:
        print("\n💥 Image generation failed!")
        print("Please check the setup and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()
