import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/theme.css';
import App from './App';

// Suppress ResizeObserver error from Monaco Editor
const resizeObserverErr = window.console.error;
window.console.error = (...args) => {
  if (args[0]?.includes?.('ResizeObserver loop')) {
    return;
  }
  resizeObserverErr(...args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

