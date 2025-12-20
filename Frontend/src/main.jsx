import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AppContextProvider from "./context/appContext";
import { AuthContextProvider } from "./context/authContext";
import SupervisorContextProvider from "./context/SupervisorContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    
      <AuthContextProvider>
        <AppContextProvider>
          <SupervisorContextProvider>
          <App />
          </SupervisorContextProvider>
        </AppContextProvider>
        
      </AuthContextProvider>
      
    </BrowserRouter>
  </StrictMode>
);
