import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
