import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// 🔐 In-memory token (NOT in React state)
let accessTokenMemory = null;

export const AuthContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAccessToken = async () => {
    try {
      // 🔁 Get token from refresh cookie
      const res = await api.get("/api/users/refresh-token");
      console.log(res);
      console.log("hello from authContext");
      accessTokenMemory = res.data.accessToken;
      setAccessToken(res.data.accessToken);
    } catch (error) {
      accessTokenMemory = null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccessToken();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👉 Used by axios
export const getStoredAccessToken = () => accessTokenMemory;

export const setStoredAccessToken = (token) => {
  accessTokenMemory = token;
};

export default AuthContext;
