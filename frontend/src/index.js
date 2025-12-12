// Hack: wrap ResizeObserver callbacks in requestAnimationFrame
// to avoid "ResizeObserver loop completed with undelivered notifications" noise.
if (typeof window !== "undefined" && "ResizeObserver" in window) {
  const OriginalResizeObserver = window.ResizeObserver;

  window.ResizeObserver = class ResizeObserverPatched extends OriginalResizeObserver {
    constructor(callback) {
      super((entries, observer) => {
        window.requestAnimationFrame(() => {
          callback(entries, observer);
        });
      });
    }
  };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
