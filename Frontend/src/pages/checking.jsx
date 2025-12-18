 import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import AuthContext from "../context/authContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Garima() {
  const { user, loading } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  // Redirect non-supervisors
  useEffect(() => {
    if (!loading && user?.role !== "Supervisor") {
      toast.error("Unauthorized access");
      console.log("hi garima");
      navigate("/hii "); // Or redirect to login/home
    }
  }, [user, loading, navigate]);

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user || user.role !== "Supervisor") return;
      setFetching(true);
      try {
        const res = await api.get("/api/supervisor/student/complaints", {
          withCredentials: true, // necessary if backend uses cookies
        });
        setComplaints(res.data);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
        toast.error(err.response?.data?.message || "Failed to load complaints");
      } finally {
        setFetching(false);
      }
    };

    fetchComplaints();
  }, [user]);

  if (loading || fetching) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-richblack-5 font-inter">
      <Navbar />

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-richblack-800 text-center mb-6">
          Hostel Complaints <br />
          <span className="text-blue-200">Management Dashboard</span>
        </h1>

        <p className="text-lg text-richblack-500 mb-8 text-center max-w-2xl">
          As a supervisor, you can view and manage complaints submitted by students. You cannot register complaints.
        </p>

        {complaints.length === 0 ? (
          <p className="text-richblack-500">No complaints available.</p>
        ) : (
          <div className="w-full max-w-4xl grid gap-4">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <p className="font-semibold text-richblack-700">{c.title}</p>
                  <p className="text-sm text-richblack-500">{c.description}</p>
                  <p className="text-xs text-richblack-400 mt-1">Category: {c.category}</p>
                </div>
                <div>
                  <p className={`px-3 py-1 rounded-full text-sm font-medium ${
                    c.status === "Pending" ? "bg-yellow-200 text-yellow-800" :
                    c.status === "Resolved" ? "bg-green-200 text-green-800" :
                    "bg-gray-200 text-gray-800"
                  }`}>
                    {c.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
