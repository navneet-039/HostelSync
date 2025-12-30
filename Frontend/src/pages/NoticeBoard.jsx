import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/api/supervisor/seeNotice"); 
        setNotices(res.data.notices);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch notices"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 pt-24 p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Hostel Notices
          </h2>

          {/* Loading */}
          {loading && (
            <p className="text-gray-600">Loading notices...</p>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          {/* No Notices */}
          {!loading && notices.length === 0 && (
            <p className="text-gray-600">No notices available.</p>
          )}

          {/* Notices List */}
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="bg-white rounded-lg shadow p-5 border"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {notice.title}
                </h3>

                <p className="text-gray-700 mt-2">
                  {notice.description}
                </p>

                <div className="mt-3 flex justify-between text-sm text-gray-500">
                  <span>
                    Published by: {notice.publishedBy?.name}
                  </span>

                  {notice.expiryDate && (
                    <span>
                      Expires on:{" "}
                      {new Date(notice.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}