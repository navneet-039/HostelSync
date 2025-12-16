import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/protectedRoute";

function Home() {
  return <h1>Dashboard</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
