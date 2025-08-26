// Utility functions for handling images and placeholders

// Wood texture placeholder using data URL
export const WOOD_TEXTURE_PLACEHOLDER = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='wood' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Crect width='40' height='40' fill='%23D2691E'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23A0522D' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23wood)'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-family='Arial' font-size='16'%3EWood Texture%3C/text%3E%3C/svg%3E";

// Teak wood placeholder
export const TEAK_WOOD_PLACEHOLDER = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='teak' x='0' y='0' width='60' height='40' patternUnits='userSpaceOnUse'%3E%3Crect width='60' height='40' fill='%23CD853F'/%3E%3Cpath d='M0 20h60M30 0v40' stroke='%23A0522D' stroke-width='2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23teak)'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-family='Arial' font-size='18' font-weight='bold'%3ETeak Wood%3C/text%3E%3C/svg%3E";

// Plywood placeholder
export const PLYWOOD_PLACEHOLDER = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23DEB887'/%3E%3Cg stroke='%23CD853F' stroke-width='2' fill='none'%3E%3Cpath d='M0 60h400M0 120h400M0 180h400M0 240h400'/%3E%3C/g%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23654321' font-family='Arial' font-size='18' font-weight='bold'%3EPlywood%3C/text%3E%3C/svg%3E";

// Hardwood placeholder
export const HARDWOOD_PLACEHOLDER = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='hardwood' x='0' y='0' width='80' height='60' patternUnits='userSpaceOnUse'%3E%3Crect width='80' height='60' fill='%238B4513'/%3E%3Ccircle cx='40' cy='30' r='15' fill='%236B3410' fill-opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23hardwood)'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-family='Arial' font-size='18' font-weight='bold'%3EHardwood%3C/text%3E%3C/svg%3E";

// Generic category placeholder
export const CATEGORY_PLACEHOLDER = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial' font-size='16'%3EProduct Image%3C/text%3E%3C/svg%3E";

// Get appropriate placeholder based on category
export const getPlaceholderImage = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'teak':
      return TEAK_WOOD_PLACEHOLDER;
    case 'plywood':
      return PLYWOOD_PLACEHOLDER;
    case 'hardwood':
      return HARDWOOD_PLACEHOLDER;
    default:
      return WOOD_TEXTURE_PLACEHOLDER;
  }
};

// Image error handler
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, category?: string) => {
  const img = event.currentTarget;
  img.src = getPlaceholderImage(category);
};