import React from 'react';
import ReactDOM from 'react-dom/client';
import WebApp from '@twa-dev/sdk';
import App from './App';
import './index.css';
import bot from './bot';

// Initialize Telegram WebApp
WebApp.ready();
bot.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);