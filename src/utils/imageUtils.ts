// Enhanced image utility with WebP support and lazy loading
// Maps categories to optimized images in /public/images/ folder

// Static images - AI-generated images from Gemini MCP with WebP support
export const TEAK_WOOD_IMAGE = '/images/teak-wood.jpg';
export const TEAK_WOOD_IMAGE_WEBP = '/images/teak-wood.webp';
export const PLYWOOD_IMAGE = '/images/plywood.jpg';
export const PLYWOOD_IMAGE_WEBP = '/images/plywood.webp';
export const HARDWOOD_IMAGE = '/images/hardwood-logs.jpg';
export const HARDWOOD_IMAGE_WEBP = '/images/hardwood-logs.webp';
export const WOOD_TEXTURE_IMAGE = '/images/wood-texture.svg';

// Keep original placeholders as fallbacks
export const WOOD_TEXTURE_PLACEHOLDER = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='wood' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Crect width='40' height='40' fill='%23D2691E'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23A0522D' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23wood)'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-family='Arial' font-size='16'%3EWood Texture%3C/text%3E%3C/svg%3E";

export const TEAK_WOOD_PLACEHOLDER = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='teak' x='0' y='0' width='60' height='40' patternUnits='userSpaceOnUse'%3E%3Crect width='60' height='40' fill='%23CD853F'/%3E%3Cpath d='M0 20h60M30 0v40' stroke='%23A0522D' stroke-width='2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23teak)'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-family='Arial' font-size='18' font-weight='bold'%3ETeak Wood%3C/text%3E%3C/svg%3E";

export const PLYWOOD_PLACEHOLDER = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23DEB887'/%3E%3Cg stroke='%23CD853F' stroke-width='2' fill='none'%3E%3Cpath d='M0 60h400M0 120h400M0 180h400M0 240h400'/%3E%3C/g%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23654321' font-family='Arial' font-size='18' font-weight='bold'%3EPlywood%3C/text%3E%3C/svg%3E";

export const HARDWOOD_PLACEHOLDER = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='hardwood' x='0' y='0' width='80' height='60' patternUnits='userSpaceOnUse'%3E%3Crect width='80' height='60' fill='%238B4513'/%3E%3Ccircle cx='40' cy='30' r='15' fill='%236B3410' fill-opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23hardwood)'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-family='Arial' font-size='18' font-weight='bold'%3EHardwood%3C/text%3E%3C/svg%3E";

// Simple function to get static image based on category
export const getPlaceholderImage = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'teak':
      return TEAK_WOOD_IMAGE;
    case 'plywood':
      return PLYWOOD_IMAGE;
    case 'hardwood':
      return HARDWOOD_IMAGE;
    default:
      return WOOD_TEXTURE_IMAGE;
  }
};

// Synchronous version for initial render (returns placeholder, then updates)
export const getPlaceholderImageSync = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'teak':
      return TEAK_WOOD_IMAGE;
    case 'plywood':
      return PLYWOOD_IMAGE;
    case 'hardwood':
      return HARDWOOD_IMAGE;
    default:
      return WOOD_TEXTURE_IMAGE;
  }
};

// Image error handler with fallback to placeholders
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, category?: string) => {
  const img = event.currentTarget;

  // Fallback to placeholder if static image fails to load
  switch (category?.toLowerCase()) {
    case 'teak':
      img.src = TEAK_WOOD_PLACEHOLDER;
      break;
    case 'plywood':
      img.src = PLYWOOD_PLACEHOLDER;
      break;
    case 'hardwood':
      img.src = HARDWOOD_PLACEHOLDER;
      break;
    default:
      img.src = WOOD_TEXTURE_PLACEHOLDER;
  }
};

// Function to check if static images exist
export const checkStaticImages = (): { [key: string]: boolean } => {
  const images = ['wood-texture.svg'];
  const results: { [key: string]: boolean } = {};

  images.forEach(imageName => {
    const img = new Image();
    img.onload = () => results[imageName] = true;
    img.onerror = () => results[imageName] = false;
    img.src = `/images/${imageName}`;
  });

  return results;
};

// Function to get image info
export const getImageInfo = (category?: string) => {
  const imagePath = getPlaceholderImage(category);
  return {
    path: imagePath,
    category: category || 'default',
    exists: imagePath.startsWith('/images/'), // Static images exist in /images folder
    isPlaceholder: imagePath.includes('data:image') // SVG placeholders
  };
};

// WebP support detection
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Get optimized image with WebP fallback
export const getOptimizedImage = async (category?: string): Promise<string> => {
  const webPSupported = await supportsWebP();
  
  if (webPSupported) {
    switch (category?.toLowerCase()) {
      case 'teak':
        return TEAK_WOOD_IMAGE_WEBP;
      case 'plywood':
        return PLYWOOD_IMAGE_WEBP;
      case 'hardwood':
        return HARDWOOD_IMAGE_WEBP;
      default:
        return getPlaceholderImage(category);
    }
  }
  
  return getPlaceholderImage(category);
};

// Lazy loading image component props
export const getLazyImageProps = (category?: string) => {
  return {
    loading: 'lazy' as const,
    decoding: 'async' as const,
    alt: `${category || 'Wood'} product image`,
    onError: (event: React.SyntheticEvent<HTMLImageElement>) => 
      handleImageError(event, category)
  };
};