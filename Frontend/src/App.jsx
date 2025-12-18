import { Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import AppContextProvider from "./context/appContext";

import Home from "./pages/homePage";
import Login from "./pages/login";
import StudentRegisteredComplaint from "./pages/StudentRegisteredComplaint";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <AuthContextProvider>
      <AppContextProvider>
        <Routes>
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
        </Routes>
      </AppContextProvider>
    </AuthContextProvider>
  );
}

export default App;
