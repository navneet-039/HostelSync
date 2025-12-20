import { Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import AppContextProvider from "./context/appContext";

import ProtectedRoute from "./components/protectedRoute";

import RoleBasedHome from "./pages/roleBasedHome";
import Login from "./pages/login";
import Contact from "./pages/contact";
import StudentRegisteredComplaint from "./pages/StudentRegisteredComplaint";
import RegisterComplaint from "./pages/regsiterComplaint";

import SupervisorContextProvider from "./context/SupervisorContext";
import SupervisorComplaint from "./pages/supervisorComplaint";

function App() {
  return (
    <AuthContextProvider>
      <Routes>

        {/* ROLE BASED HOME */}
        <Route path="/" element={<RoleBasedHome />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />

        {/* STUDENT ROUTES */}
        <Route
          path="/all-complaints"
          element={
            <ProtectedRoute roles={["Student"]}>
              <AppContextProvider>
                <StudentRegisteredComplaint />
              </AppContextProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/register-complaints"
          element={
            <ProtectedRoute roles={["Student"]}>
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
                <SupervisorComplaint />
              </SupervisorContextProvider>
            </ProtectedRoute>
          }
        />

      </Routes>
    </AuthContextProvider>
  );
}

export default App;
