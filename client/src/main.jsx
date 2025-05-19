import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from "react-redux";
import { store, persistor } from './Redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';

// Loading component
const LoadingComponent = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="text-xl font-semibold">Loading...</div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
