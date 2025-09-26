/**
 * Test setup file for Vitest and React Testing Library
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock requestIdleCallback
global.requestIdleCallback = (callback: () => void) => {
  setTimeout(callback, 0);
  return 1;
};

// Mock cancelIdleCallback
global.cancelIdleCallback = () => {};

// Mock performance API
global.performance = {
  now: () => Date.now(),
  mark: () => {},
  measure: () => {},
  getEntriesByType: () => [],
  getEntriesByName: () => [],
  clearMarks: () => {},
  clearMeasures: () => {}
} as any;

// Mock fetch
global.fetch = () => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(''),
  blob: () => Promise.resolve(new Blob()),
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  formData: () => Promise.resolve(new FormData()),
  headers: new Headers(),
  status: 200,
  statusText: 'OK',
  type: 'basic',
  url: '',
  clone: () => new Response(),
  body: null,
  bodyUsed: false
} as Response);

// Mock Image constructor
global.Image = class Image {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';
  width = 0;
  height = 0;
  naturalWidth = 0;
  naturalHeight = 0;
  
  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
} as any;

// Mock HTMLCanvasElement
global.HTMLCanvasElement = class HTMLCanvasElement {
  getContext() {
    return {
      drawImage: () => {},
      getImageData: () => ({
        data: new Uint8ClampedArray(4)
      })
    };
  }
  
  toDataURL() {
    return 'data:image/webp;base64,test';
  }
  
  width = 800;
  height = 600;
} as any;

// Mock CSS.supports
global.CSS = {
  supports: (property: string, value: string) => {
    return true; // Mock support for all CSS features
  }
} as any;

