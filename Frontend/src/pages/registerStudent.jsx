import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Navbar from "../components/navbar";

export default function RegisterStudent() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    registrationNumber: "",
    password: "",
    branch: "",
    year: "",
    roomNumber: "",
    floor: "",
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
      const res = await api.post("/api/users/register", formData, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Student registered successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        registrationNumber: "",
        password: "",
        branch: "",
        year: "",
        roomNumber: "",
        floor: "",
      });

      navigate("/supervisor");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-richblack-5 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-richblack-900">
              Student Registration
            </h2>
            <p className="text-sm text-richblack-500 mt-1">
              Enter student details carefully
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name + Reg No */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Branch + Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
              />
              <FormField
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              />
            </div>

            {/* Room Number + Floor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Room Number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
              />
              <FormField
                label="Floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <FormField
              label="Temporary Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-richblue-500 text-white py-3 rounded-lg font-semibold hover:bg-richblue-600 disabled:opacity-60 transition"
            >
              {loading ? "Registering..." : "Register Student"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// ---------------- FORM FIELD COMPONENT ----------------
function FormField({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-richblack-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        required
        {...props}
        className="w-full border border-richblack-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-richblue-500 focus:border-transparent transition"
      />
    </div>
  );
}
