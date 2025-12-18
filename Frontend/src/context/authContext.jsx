import { createContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

let accessTokenMemory = null;

export const AuthContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users/refresh-token", { withCredentials: true });

      if (res.data?.accessToken && res.data?.user) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        accessTokenMemory = res.data.accessToken;
      } else {
        setAccessToken(null);
        setUser(null);
        accessTokenMemory = null;
      }
    } catch (err) {
      setAccessToken(null);
      setUser(null);
      accessTokenMemory = null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/users/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      setAccessToken(null);
      setUser(null);
      accessTokenMemory = null;
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        setAccessToken,
        setUser,
        logout,
        reloadUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const getStoredAccessToken = () => accessTokenMemory;
export const setStoredAccessToken = (token) => (accessTokenMemory = token);

export default AuthContext;
