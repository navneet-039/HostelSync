import { useContext } from "react";
import AuthContext from "../context/authContext";
import Home from "./homePage";
import SupervisorHomePage from "./SupervisorHomepage";
import Login from "./login";
export default function RoleBasedHome() {
  const { user, loading } = useContext(AuthContext);
  // if (loading) {
  //   return <p className="text-center mt-20">Loading...</p>;
  // }
  if (!user) {
    return <Login />;
  }
  if (user.role === "Supervisor") {
    return <SupervisorHomePage />;
  }
  if (user.role === "Student") {
    return <Home />;
  }
  return <Login />;
}
