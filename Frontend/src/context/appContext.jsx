import { createContext, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AuthContext from "./authContext";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const { accessToken, loading } = useContext(AuthContext);

  const [studentComplaints, setStudentComplaints] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchStudentComplaints = async () => {
    setDataLoading(true);
    try {
      const { data } = await api.get(
        "/api/supervisor/student/complaints"
      );
      setStudentComplaints(data.complaints || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch complaints"
      );
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && accessToken) {
      fetchStudentComplaints();
    }
  }, [loading, accessToken]);

  return (
    <AppContext.Provider value={{ studentComplaints, dataLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
