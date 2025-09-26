#!/usr/bin/env python3
"""
Setup script to configure API keys for image generation
"""

import os
import sys
from pathlib import Path

def setup_api_keys():
    """Interactive setup for API keys"""
    
    print("🔧 Setting up API keys for image generation...")
    print("=" * 50)
    
    # Check current environment
    kie_key = os.environ.get("KIE_API_KEY")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    
    print(f"Current KIE_API_KEY: {'✅ Set' if kie_key else '❌ Not set'}")
    print(f"Current GEMINI_API_KEY: {'✅ Set' if gemini_key else '❌ Not set'}")
    print()
    
    # Get KIE API key
    if not kie_key:
        print("📋 To get a KIE.ai API key:")
        print("1. Visit: https://kie.ai/")
        print("2. Sign up for an account")
        print("3. Get your API key from the dashboard")
        print()
        
        kie_key = input("Enter your KIE.ai API key (or press Enter to skip): ").strip()
        if kie_key:
            os.environ["KIE_API_KEY"] = kie_key
            print("✅ KIE_API_KEY set for this session")
    
    # Get Gemini API key (optional)
    if not gemini_key:
        print("\n📋 To get a Google Gemini API key (optional, for fallback):")
        print("1. Visit: https://makersuite.google.com/app/apikey")
        print("2. Create a new API key")
        print("3. Copy the key")
        print()
        
        gemini_key = input("Enter your Gemini API key (or press Enter to skip): ").strip()
        if gemini_key:
            os.environ["GEMINI_API_KEY"] = gemini_key
            print("✅ GEMINI_API_KEY set for this session")
    
    # Set output directory
    output_path = Path(__file__).parent.parent / "generated-images"
    os.environ["OUTPUT_IMAGE_PATH"] = str(output_path)
    print(f"✅ OUTPUT_IMAGE_PATH set to: {output_path}")
    
    print("\n" + "=" * 50)
    print("🎯 Next steps:")
    print("1. Run: python3 test_image_generation.py")
    print("2. Or start the MCP server: python3 run_server.py")
    print()
    
    # Create .env file for persistence
    env_file = Path(__file__).parent.parent / ".env"
    with open(env_file, "a") as f:
        f.write("\n# Image Generation API Keys\n")
        if kie_key:
            f.write(f"KIE_API_KEY={kie_key}\n")
        if gemini_key:
            f.write(f"GEMINI_API_KEY={gemini_key}\n")
        f.write(f"OUTPUT_IMAGE_PATH={output_path}\n")
    
    print(f"💾 API keys saved to: {env_file}")
    print("⚠️  Remember to add .env to your .gitignore file!")

if __name__ == "__main__":
    setup_api_keys()
