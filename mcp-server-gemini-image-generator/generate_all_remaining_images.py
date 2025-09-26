#!/usr/bin/env python3
"""
Generate all remaining AI images and organize them properly
"""

import asyncio
import os
import sys
import shutil
from pathlib import Path

# Add the src directory to Python path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

from mcp_server_gemini_image_generator.kie_client import get_kie_client
from mcp_server_gemini_image_generator.utils import save_image

# Product configurations
PRODUCTS = [
    {
        "name": "burma_teak_grade_a_timber",
        "prompt": "Professional product photography of Burma Teak Grade A Timber, superior grain patterns, premium quality, workshop setting, commercial grade, high resolution"
    }
]

async def generate_all_remaining_images():
    """Generate all remaining AI images and organize them"""
    
    print("🪵 Complete Image Generation & Organization")
    print("=" * 60)
    
    # Check API key
    if not os.environ.get("KIE_API_KEY"):
        print("❌ KIE_API_KEY not set!")
        return False
    
    try:
        client = get_kie_client()
        output_dir = Path(__file__).parent / "generated-images"
        output_dir.mkdir(exist_ok=True)
        
        # Generate remaining images
        for product in PRODUCTS:
            print(f"\n🚀 Generating {product['name']}...")
            print(f"📝 Prompt: {product['prompt']}")
            
            image_data, image_url = await client.generate_image(
                prompt=product['prompt'],
                output_format="png",
                image_size="16:9"
            )
            
            filename = f"{product['name']}.png"
            file_path = save_image(image_data, filename=filename, output_dir=str(output_dir))
            
            print(f"✅ Generated: {file_path}")
            print(f"📊 Size: {len(image_data)} bytes")
            print(f"🔗 URL: {image_url}")
        
        # Organize all images
        print(f"\n📁 Organizing all generated images...")
        
        # Source and destination directories
        source_dir = Path(__file__).parent / "generated-images"
        public_dir = Path(__file__).parent.parent / "public" / "generated-images"
        images_dir = Path(__file__).parent.parent / "public" / "images" / "products"
        
        # Create destination directories
        public_dir.mkdir(parents=True, exist_ok=True)
        images_dir.mkdir(parents=True, exist_ok=True)
        
        # List of all generated images
        all_images = [
            "burma_teak_door.png",
            "marine_plywood_19mm.png", 
            "ghana_teak_window_frame.png",
            "century_ply_sainik_mr_18mm.png",
            "teak_hardwood_log.png",
            "burma_teak_grade_a_timber.png"
        ]
        
        # Copy all images to both locations
        for image_name in all_images:
            source_file = source_dir / image_name
            if source_file.exists():
                # Copy to public/generated-images
                public_file = public_dir / image_name
                shutil.copy2(source_file, public_file)
                print(f"📋 Copied to public/generated-images/: {image_name}")
                
                # Copy to public/images/products
                product_file = images_dir / image_name
                shutil.copy2(source_file, product_file)
                print(f"📋 Copied to public/images/products/: {image_name}")
            else:
                print(f"⚠️  Not found: {image_name}")
        
        print(f"\n🎉 All images generated and organized successfully!")
        print(f"📁 Generated images: {len(all_images)}")
        print(f"📂 Public directory: {public_dir}")
        print(f"📂 Products directory: {images_dir}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(generate_all_remaining_images())
