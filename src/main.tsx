import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent uncaught cross-origin frame SecurityErrors from breaking sandboxed iframe preview
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message &&
      (event.message.includes('cross-origin frame') ||
        event.message.includes('Blocked a frame') ||
        event.message.includes('SecurityError'))
    ) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
      return true;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : reason?.message;
    if (
      msg &&
      (msg.includes('cross-origin frame') ||
        msg.includes('Blocked a frame') ||
        msg.includes('SecurityError'))
    ) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
