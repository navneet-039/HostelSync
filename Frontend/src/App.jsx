import { Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import AppContextProvider from "./context/appContext";
import Contact from "./pages/contact";

import Home from "./pages/homePage";
import Login from "./pages/login";
import StudentRegisteredComplaint from "./pages/StudentRegisteredComplaint";
import ProtectedRoute from "./components/protectedRoute";
import RegisterComplaint from "./pages/regsiterComplaint";
import Garima from "./pages/checking.jsx"



function App() {
  return (
    <AuthContextProvider>
      <AppContextProvider>
        <Routes>
          <Route path="/garima" element={<Garima />} />
          
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={<Login />} />
          <Route
            path="/all-complaints"
            element={
              <ProtectedRoute>
                <StudentRegisteredComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-complaints"
            element={
              <ProtectedRoute>
                <RegisterComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              
                <Contact />
              
            }
          />
          

        
         
        </Routes>
      </AppContextProvider>
    </AuthContextProvider>
  );
}

export default App;
