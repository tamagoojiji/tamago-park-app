import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './styles/global.css';

// グローバルエラー通知
const ERROR_REPORT_URL = (import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com') + '/error-report';
const reportedErrors = new Set<string>();

function reportError(message: string, source?: string, lineno?: number, colno?: number, stack?: string) {
  const key = `${message}:${source}:${lineno}`;
  if (reportedErrors.has(key)) return;
  reportedErrors.add(key);
  fetch(ERROR_REPORT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, source, lineno, colno, stack, url: location.href, userAgent: navigator.userAgent }),
  }).catch(() => {});
}

window.onerror = (message, source, lineno, colno, error) => {
  reportError(String(message), source as string, lineno, colno, error?.stack);
};

window.onunhandledrejection = (event) => {
  const err = event.reason;
  reportError(err?.message || String(err), undefined, undefined, undefined, err?.stack);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
