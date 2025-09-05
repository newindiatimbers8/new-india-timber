import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 Starting Timber Craft Commerce Hub...');
console.log('Environment:', import.meta.env.MODE);

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error('Root element not found');
}

console.log('✅ Root element found, rendering app...');
createRoot(rootElement).render(<App />);
