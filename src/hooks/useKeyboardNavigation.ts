/**
 * useKeyboardNavigation Hook
 * Provides keyboard navigation utilities for accessibility
 */

import { useEffect, useCallback, useRef, useState } from 'react';

interface KeyboardNavigationOptions {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
  onSpace?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions = {}) => {
  const {
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onShiftTab,
    onSpace,
    onHome,
    onEnd,
    onPageUp,
    onPageDown,
    preventDefault = true,
    stopPropagation = false
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, shiftKey } = event;

    // Handle different key combinations
    switch (key) {
      case 'Enter':
        onEnter?.();
        break;
      case 'Escape':
        onEscape?.();
        break;
      case 'ArrowUp':
        onArrowUp?.();
        break;
      case 'ArrowDown':
        onArrowDown?.();
        break;
      case 'ArrowLeft':
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        onArrowRight?.();
        break;
      case 'Tab':
        if (shiftKey) {
          onShiftTab?.();
        } else {
          onTab?.();
        }
        break;
      case ' ':
        onSpace?.();
        break;
      case 'Home':
        onHome?.();
        break;
      case 'End':
        onEnd?.();
        break;
      case 'PageUp':
        onPageUp?.();
        break;
      case 'PageDown':
        onPageDown?.();
        break;
    }

    if (preventDefault) {
      event.preventDefault();
    }

    if (stopPropagation) {
      event.stopPropagation();
    }
  }, [
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onShiftTab,
    onSpace,
    onHome,
    onEnd,
    onPageUp,
    onPageDown,
    preventDefault,
    stopPropagation
  ]);

  return { handleKeyDown };
};

// Hook for managing focus within a container
export const useFocusManagement = () => {
  const containerRef = useRef<HTMLElement>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentIndexRef = useRef(0);

  const updateFocusableElements = useCallback(() => {
    if (!containerRef.current) return;

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    focusableElementsRef.current = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }, []);

  const focusNext = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElementsRef.current;
    
    if (elements.length === 0) return;

    currentIndexRef.current = (currentIndexRef.current + 1) % elements.length;
    elements[currentIndexRef.current]?.focus();
  }, [updateFocusableElements]);

  const focusPrevious = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElementsRef.current;
    
    if (elements.length === 0) return;

    currentIndexRef.current = currentIndexRef.current === 0 
      ? elements.length - 1 
      : currentIndexRef.current - 1;
    elements[currentIndexRef.current]?.focus();
  }, [updateFocusableElements]);

  const focusFirst = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElementsRef.current;
    
    if (elements.length > 0) {
      currentIndexRef.current = 0;
      elements[0]?.focus();
    }
  }, [updateFocusableElements]);

  const focusLast = useCallback(() => {
    updateFocusableElements();
    const elements = focusableElementsRef.current;
    
    if (elements.length > 0) {
      currentIndexRef.current = elements.length - 1;
      elements[elements.length - 1]?.focus();
    }
  }, [updateFocusableElements]);

  const focusElement = useCallback((index: number) => {
    updateFocusableElements();
    const elements = focusableElementsRef.current;
    
    if (index >= 0 && index < elements.length) {
      currentIndexRef.current = index;
      elements[index]?.focus();
    }
  }, [updateFocusableElements]);

  const getCurrentIndex = useCallback(() => {
    return currentIndexRef.current;
  }, []);

  const getFocusableCount = useCallback(() => {
    updateFocusableElements();
    return focusableElementsRef.current.length;
  }, [updateFocusableElements]);

  return {
    containerRef,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    focusElement,
    getCurrentIndex,
    getFocusableCount,
    updateFocusableElements
  };
};

// Hook for arrow key navigation in lists
export const useArrowKeyNavigation = <T>(
  items: T[],
  onSelect: (item: T, index: number) => void,
  options: {
    initialIndex?: number;
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
  } = {}
) => {
  const { initialIndex = -1, loop = true, orientation = 'vertical' } = options;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    const isVertical = orientation === 'vertical';
    const isHorizontal = orientation === 'horizontal';

    let newIndex = selectedIndex;

    switch (key) {
      case isVertical ? 'ArrowDown' : 'ArrowRight':
        event.preventDefault();
        if (loop) {
          newIndex = selectedIndex === items.length - 1 ? 0 : selectedIndex + 1;
        } else {
          newIndex = Math.min(selectedIndex + 1, items.length - 1);
        }
        break;
      case isVertical ? 'ArrowUp' : 'ArrowLeft':
        event.preventDefault();
        if (loop) {
          newIndex = selectedIndex === 0 ? items.length - 1 : selectedIndex - 1;
        } else {
          newIndex = Math.max(selectedIndex - 1, 0);
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          onSelect(items[selectedIndex], selectedIndex);
        }
        return;
    }

    if (newIndex !== selectedIndex && newIndex >= 0 && newIndex < items.length) {
      setSelectedIndex(newIndex);
    }
  }, [selectedIndex, items, onSelect, loop, orientation]);

  const selectItem = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setSelectedIndex(index);
      onSelect(items[index], index);
    }
  }, [items, onSelect]);

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    selectItem
  };
};

// Hook for escape key handling
export const useEscapeKey = (callback: () => void) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback]);
};

// Hook for click outside detection
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback]);
};

export default useKeyboardNavigation;
