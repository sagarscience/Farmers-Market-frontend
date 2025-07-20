import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ChatProvider } from "./context/ChatContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ChatProvider>
           
          <App />
          </ChatProvider>
          <ToastContainer position="top-right" autoClose={2000} />
          
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
