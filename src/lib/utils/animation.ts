import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 * Handles conditional classes and deduplicates Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Animation variants for Framer Motion
 * Predefined animation configurations for consistent UI animations
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideDown = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideInFromLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    x: -50, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideInFromRight = {
  hidden: { x: 50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    x: 50, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

/**
 * Staggered animation for child elements
 * @param delayChildren Delay before starting child animations (in seconds)
 * @param staggerChildren Delay between each child animation (in seconds)
 */
export const staggerContainer = (delayChildren = 0.1, staggerChildren = 0.1) => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren,
      staggerChildren
    }
  }
});

/**
 * Animation for button hover/active states
 */
export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2, ease: 'easeOut' }
};

export const buttonTap = {
  scale: 0.95
};

/**
 * Animation for cards on hover
 */
export const cardHover = {
  y: -5,
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  transition: { duration: 0.3, ease: 'easeOut' }
};

/**
 * Animation for loading skeletons
 */
export const skeletonPulse = {
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 }
};

/**
 * Animation for tooltips and popovers
 */
export const popIn = {
  hidden: { 
    opacity: 0, 
    y: 10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

/**
 * Animation for page transitions
 */
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

/**
 * Animation for modal overlays
 */
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

/**
 * Animation for dropdown menus
 */
export const dropdownMenu = {
  hidden: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.1 }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.1 }
  }
};
