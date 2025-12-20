import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

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

      // Clear form
      setFormData({
        name: "",
        registrationNumber: "",
        email: "",
        password: "",
        hostel: "",
        room: "",
      });

      // Redirect supervisor
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
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Register Student
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="registrationNumber"
            placeholder="Registration Number"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Temporary Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="hostel"
            placeholder="Hostel Name"
            value={formData.hostel}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="room"
            placeholder="Room Number"
            value={formData.room}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Registering..." : "Register Student"}
          </button>

        </form>
      </div>
    </div>
  );
}
