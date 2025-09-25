import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Admin Blog Categories Testing
 * 
 * This configuration supports:
 * - TypeScript testing
 * - Cross-browser testing (Chrome, Firefox, Safari)
 * - Parallel test execution
 * - Screenshot and video capture on failures
 * - Test reporting and CI/CD integration
 */

export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Global test configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  // Global test options
  use: {
    // Base URL for all tests
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:8080',
    
    // Browser context options
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Timeout settings
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Viewport settings
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors for local development
    ignoreHTTPSErrors: true,
  },
  
  // Test timeout
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  
  // Output directory for test artifacts
  outputDir: 'test-results/',
  
  // Global setup and teardown
  globalSetup: require.resolve('./tests/utils/global-setup.ts'),
  globalTeardown: require.resolve('./tests/utils/global-teardown.ts'),
  
  // Projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // Web server configuration for local development
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});