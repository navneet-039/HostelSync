import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const [studentComplaints, setStudentComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudentComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/supervisor/student/complaints");
      setStudentComplaints(data.complaints || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentComplaints();
  }, []);

  return (
    <AppContext.Provider value={{ studentComplaints, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
