import React from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css';
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './shared/theme/ThemeProvider.tsx';
import '@shared/services/i18n';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)