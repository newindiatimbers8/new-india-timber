# Timber Craft Commerce Hub

A comprehensive e-commerce platform for premium timber and wood products, featuring advanced image generation capabilities, modern UI components, and robust testing infrastructure.

## Project Description

Timber Craft Commerce Hub is a full-stack React application built with TypeScript, featuring:

- **Modern E-commerce Platform**: Complete timber product catalog with advanced filtering and search
- **AI-Powered Image Generation**: Integration with Google Gemini and KIE.ai for dynamic product imagery
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui components
- **Comprehensive Testing**: Unit, integration, and E2E tests with Playwright
- **Performance Optimized**: Vite build system with optimized assets and lazy loading
- **SEO Ready**: Meta tags, structured data, and search engine optimization
- **Admin Dashboard**: Content management system for products and blog posts

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui, Radix UI
- **State Management**: TanStack Query, React Hook Form
- **Testing**: Vitest, Playwright, Testing Library
- **Image Generation**: Google Gemini AI, KIE.ai Nano Banana API
- **Build Tools**: Vite, PostCSS, ESLint
- **Deployment**: Vercel-ready configuration

## How to Run

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+ (for MCP server)
- Google Gemini API key (optional, for image generation)
- KIE.ai API key (optional, for fast image generation)

### Installation

1. **Clone the repository:**
```bash
git clone <YOUR_GIT_URL>
cd timber-craft-commerce-hub
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
# Copy the example environment file
cp env.example.txt .env

# Edit .env with your API keys (optional)
# GEMINI_API_KEY=your-gemini-api-key
# KIE_API_KEY=your-kie-api-key
```

4. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Additional Setup (Optional)

#### MCP Image Generation Server

For AI-powered image generation features:

1. **Navigate to the MCP server directory:**
```bash
cd mcp-server-gemini-image-generator
```

2. **Set up Python environment:**
```bash
# Using uv (recommended)
uv venv
source .venv/bin/activate

# Or using regular venv
python -m venv .venv
source .venv/bin/activate
```

3. **Install dependencies:**
```bash
uv pip install -e .
# or
pip install -e .
```

4. **Configure API keys:**
```bash
export GEMINI_API_KEY="your-gemini-api-key"
export KIE_API_KEY="your-kie-api-key"
```

5. **Start the MCP server:**
```bash
fastmcp dev src/mcp_server_gemini_image_generator/server.py
```

## How to Test

### Running Tests

1. **Run all tests:**
```bash
npm test
```

2. **Run tests with UI:**
```bash
npm run test:ui
```

3. **Run tests with coverage:**
```bash
npm run test:coverage
```

4. **Run specific test suites:**
```bash
# Unit tests
npm test -- tests/unit

# Integration tests
npm test -- tests/integration

# E2E tests
npm test -- tests/e2e

# Accessibility tests
npm test -- tests/a11y
```

### Test Structure

- **Unit Tests** (`tests/unit/`): Component and utility function tests
- **Integration Tests** (`tests/integration/`): API and service integration tests
- **E2E Tests** (`tests/e2e/`): End-to-end user journey tests
- **Accessibility Tests** (`tests/a11y/`): WCAG compliance tests
- **Performance Tests** (`tests/performance/`): Load and performance tests

### Playwright E2E Testing

```bash
# Run Playwright tests
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/homepage.spec.ts
```

### Testing MCP Server

```bash
# Test the image generation server
cd mcp-server-gemini-image-generator
python test-gemini-mcp.py
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run migrate:backup` - Backup current data

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── data/               # Static data and configurations
└── lib/                # Library configurations

tests/
├── unit/               # Unit tests
├── integration/        # Integration tests
├── e2e/                # End-to-end tests
├── a11y/               # Accessibility tests
└── performance/        # Performance tests

mcp-server-gemini-image-generator/
├── src/                # MCP server source code
├── examples/           # Generated image examples
└── tests/              # Server tests
```

## Deployment

### Vercel Deployment

1. **Build the project:**
```bash
npm run build
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment

1. **Build for production:**
```bash
npm run build
```

2. **Serve the dist folder** with any static file server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository or contact the development team.