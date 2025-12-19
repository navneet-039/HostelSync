import { Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import AppContextProvider from "./context/appContext";

import ProtectedRoute from "./components/protectedRoute";

import Home from "./pages/homePage";
import Login from "./pages/login";
import Contact from "./pages/contact";
import StudentRegisteredComplaint from "./pages/StudentRegisteredComplaint";
import RegisterComplaint from "./pages/regsiterComplaint";
import Garima from "./pages/checking.jsx";

import SupervisorContextProvider from "./context/SupervisorContext";
import SupervisorDashboard from "./pages/supervisorComplaint";

function App() {
  return (
    <AuthContextProvider>

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/garima" element={<Garima />} />

        {/* STUDENT ROUTES */}
        <Route
          path="/all-complaints"
          element={
            <ProtectedRoute>
              <AppContextProvider>
                <StudentRegisteredComplaint />
              </AppContextProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/register-complaints"
          element={
            <ProtectedRoute>
              <AppContextProvider>
                <RegisterComplaint />
              </AppContextProvider>
            </ProtectedRoute>
          }
        />

        {/* SUPERVISOR ROUTE */}
        <Route
          path="/supervisor"
          element={
            <ProtectedRoute roles={["Supervisor"]}>
              <SupervisorContextProvider>
                <SupervisorDashboard />
              </SupervisorContextProvider>
            </ProtectedRoute>
          }
        />

      </Routes>

    </AuthContextProvider>
  );
}

export default App;
