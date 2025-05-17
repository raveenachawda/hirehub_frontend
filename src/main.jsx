import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Toaster } from "./components/ui/sonner";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
const persistor =persistStore(store);


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <App />
      </PersistGate>
     
      
      <Toaster/>
    </Provider>
  </React.StrictMode>
);
