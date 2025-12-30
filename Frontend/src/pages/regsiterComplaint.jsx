import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiAlertCircle } from "react-icons/fi";
import {
  MdElectricalServices,
  MdWaterDrop,
  MdChair,
  MdCleaningServices,
} from "react-icons/md";

import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function RegisterComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    { label: "Electricity", icon: <MdElectricalServices /> },
    { label: "Water", icon: <MdWaterDrop /> },
    { label: "Furniture", icon: <MdChair /> },
    { label: "Cleaning", icon: <MdCleaningServices /> },
    { label: "Other", icon: <FiAlertCircle /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/complaints/register", formData, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Complaint registered successfully");
      navigate("/all-complaints");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to register complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Page Background */}
      <div className="min-h-screen bg-gradient-to-br from-richblue-5 to-pure-greys-5 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Card */}
          <div className="bg-white border border-pure-greys-25 shadow-md">
            {/* Header */}
            <div className="px-6 py-5 border-b border-pure-greys-25">
              <h1 className="text-2xl font-semibold text-richblue-400">
                Hostel Complaint Registration
              </h1>
              <p className="text-sm text-pure-greys-400 mt-1">
                Submit issues related to hostel facilities for prompt resolution
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Complaint Title */}
              <div>
                <label className="block text-sm font-medium text-pure-greys-700 mb-1">
                  Complaint Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Fan not working in Room 204"
                  className="w-full px-3 py-2 border border-pure-greys-50 text-sm
                    focus:border-richblue-300 focus:ring-1 focus:ring-richblue-200 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-pure-greys-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Explain the issue clearly..."
                  className="w-full px-3 py-2 border border-pure-greys-50 text-sm resize-none
                    focus:border-richblue-300 focus:ring-1 focus:ring-richblue-200 outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-pure-greys-700 mb-3">
                  Complaint Category
                </label>

                <div className="grid grid-cols-2 gap-4">
                  {categories.map((item) => (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() =>
                        setFormData({ ...formData, category: item.label })
                      }
                      className={`flex items-center gap-3 px-4 py-3 border text-sm transition
                        ${
                          formData.category === item.label
                            ? "border-richblue-300 bg-richblue-5 text-richblue-400"
                            : "border-pure-greys-50 hover:bg-pure-greys-5"
                        }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-pure-greys-25">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 text-sm font-semibold tracking-wide transition
                    ${
                      loading
                        ? "bg-pure-greys-200 cursor-not-allowed"
                        : "bg-richblue-400 hover:bg-richblue-500 text-white"
                    }`}
                >
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
