/// <reference types="vite/client" />
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';


const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Router basename={import.meta.env.VITE_ROUTER_BASE || ''}>
        <App />
      </Router>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}