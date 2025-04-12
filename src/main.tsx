
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set light mode as default
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(<App />);
