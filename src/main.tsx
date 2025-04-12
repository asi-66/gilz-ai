
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set dark mode as default
document.documentElement.classList.remove('light');
document.documentElement.classList.add('dark');

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(<App />);
