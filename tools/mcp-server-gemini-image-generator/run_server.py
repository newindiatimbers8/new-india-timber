#!/usr/bin/env python3
"""
Wrapper script to run the MCP server with correct Python path setup.
This ensures the server can be loaded properly by Cursor's MCP system.
"""

import sys
import os
from pathlib import Path

# Add the src directory to Python path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

# Set up environment variables if not already set
if not os.environ.get("GEMINI_API_KEY"):
    print("Warning: GEMINI_API_KEY not set")
if not os.environ.get("KIE_API_KEY"):
    print("Warning: KIE_API_KEY not set")
if not os.environ.get("OUTPUT_IMAGE_PATH"):
    output_path = Path(__file__).parent.parent / "generated-images"
    os.environ["OUTPUT_IMAGE_PATH"] = str(output_path)
    print(f"Set OUTPUT_IMAGE_PATH to: {output_path}")

# Import and run the server
try:
    from mcp_server_gemini_image_generator.server import main
    print("Starting MCP server...")
    main()
except Exception as e:
    print(f"Error starting MCP server: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
