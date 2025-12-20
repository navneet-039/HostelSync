import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function RegisterStudent() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    email: "",
    password: "",
    hostel: "",
    room: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post(
        "/api/users/register",
        formData,
        { withCredentials: true }
      );

      toast.success(res.data.message || "Student registered successfully");

      setFormData({
        name: "",
        registrationNumber: "",
        email: "",
        password: "",
        hostel: "",
        room: "",
      });

      navigate("/supervisor");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Student Registration
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter student details carefully
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <FormField
              label="Student Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <FormField
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
            />

            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormField
              label="Temporary Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            

            <FormField
              label="Room Number"
              name="room"
              value={formData.room}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold
                         hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register Student"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* 🔁 Reusable Field Component */
function FormField({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        required
        {...props}
        className="w-full border rounded-lg px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}