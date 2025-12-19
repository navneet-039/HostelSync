import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiAlertCircle } from "react-icons/fi";
import { MdElectricalServices, MdWaterDrop, MdChair, MdCleaningServices } from "react-icons/md";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(
        "/api/complaints/register",
        formData,
        { withCredentials: true }
      );

      toast.success(res.data.message || "Complaint registered successfully");
      navigate("/all-complaints");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Page background */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="bg-blue-600 text-white px-8 py-6 flex items-center gap-4">
              <FiAlertCircle size={32} />
              <div>
                <h2 className="text-2xl font-semibold">Register a Complaint</h2>
                <p className="text-blue-100 text-sm">
                  Let us know the issue you’re facing in your hostel
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complaint Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Fan not working"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Explain the issue in detail..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Electricity", icon: <MdElectricalServices /> },
                    { label: "Water", icon: <MdWaterDrop /> },
                    { label: "Furniture", icon: <MdChair /> },
                    { label: "Cleaning", icon: <MdCleaningServices /> },
                    { label: "Other", icon: <FiAlertCircle /> },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() =>
                        setFormData({ ...formData, category: item.label })
                      }
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition
                        ${
                          formData.category === item.label
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t pt-6" />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-lg font-semibold transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}