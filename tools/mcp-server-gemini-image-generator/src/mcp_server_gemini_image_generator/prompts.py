"""
Prompt templates for image generation and transformation
"""

def get_image_generation_prompt(base_prompt: str, style: str = "professional") -> str:
    """Generate a detailed prompt for image generation"""
    
    style_prompts = {
        "professional": "Professional product photography with clean lighting, high resolution, commercial quality",
        "artistic": "Artistic interpretation with creative lighting and composition",
        "minimalist": "Minimalist design with clean lines and simple composition",
        "vintage": "Vintage style with warm tones and classic composition"
    }
    
    style_desc = style_prompts.get(style, style_prompts["professional"])
    
    return f"{base_prompt}. {style_desc}. High quality, detailed, sharp focus, well-lit, commercial photography style."

def get_image_transformation_prompt(original_description: str, transformation: str) -> str:
    """Generate a prompt for image transformation"""
    
    return f"Transform this {original_description} by {transformation}. Maintain high quality and professional appearance."

def get_translate_prompt(text: str, target_language: str) -> str:
    """Generate a prompt for text translation"""
    
    return f"Translate the following text to {target_language}: {text}"
