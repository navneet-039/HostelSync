import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import CircularProgress from "@mui/material/CircularProgress";

export default function SupervisorComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/api/complaints/${id}`);
        setComplaint(res.data.complaint);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center mt-24">
        <CircularProgress />
      </div>
    );
  }

  if (!complaint) {
    return <p className="text-center mt-24">Complaint not found</p>;
  }

  return (
    <div className="min-h-screen bg-richblack-5">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">Complaint Details</h2>

        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <Detail label="Student Name" value={complaint.student?.name} />
          <Detail
            label="Registration Number"
            value={complaint.student?.registrationNumber}
          />
          <Detail label="Room Number" value={complaint.student?.roomNumber} />
          <Detail label="Hostel" value={complaint.student?.hostel?.name} />
          <Detail label="Status" value={complaint.status} />

          <div>
            <p className="font-semibold text-richblack-700 mb-1">
              Description
            </p>
            <p className="text-richblack-600">
              {complaint.description}
            </p>
          </div>

          {complaint.image && (
            <div>
              <p className="font-semibold mb-2">Attached Image</p>
              <img
                src={complaint.image}
                alt="Complaint"
                className="rounded-lg max-h-80"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="font-semibold text-richblack-700">{label}</p>
    <p className="text-richblack-600">{value || "—"}</p>
  </div>
);
