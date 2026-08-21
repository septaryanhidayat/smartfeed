import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { HistoryProvider } from './context/HistoryContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

// Segera hilangkan initial-loader agar tidak pernah stuck di layar loading/logo
try {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.display = 'none';
    loader.remove();
  }
} catch (e) {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

// Tandai React sudah mount — dipakai watchdog di index.html
window.__AF_MOUNTED = true;

// Extra safety removal
setTimeout(() => {
  try {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.display = 'none';
      loader.remove();
    }
  } catch (e) {}
}, 50);
