import React, { useContext, useState } from "react";
import { SupervisorContext } from "../context/SupervisorContext";
import Navbar from "../components/Navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const STATUSES = ["Pending", "In_progress", "Resolved"];

export default function SupervisorComplaint() {
  const {
    complaints = [],
    dataLoading,
    fetchSupervisorComplaints,
  } = useContext(SupervisorContext);
  const navigate = useNavigate();


  const [activeRow, setActiveRow] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ---------------- UPDATE STATUS ----------------
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      const res = await api.patch(`/api/complaints/status/${id}`, {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success("Status updated");
        setActiveRow(null);
        fetchSupervisorComplaints();
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // ---------------- STATUS STYLE ----------------
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-richblack-25 text-richblack-700 border border-richblack-100";
      case "In_progress":
        return "bg-richblack-50 text-richblack-800 border border-richblack-200";
      case "Resolved":
        return "bg-richblack-100 text-richblack-900 border border-richblack-300";
      default:
        return "";
    }
  };

  if (dataLoading) {
    return (
      <p className="text-center mt-24 text-xl font-medium text-richblack-500">
        Loading complaints...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-5">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-richblack-900">
          Hostel Complaints
        </h2>

        {complaints.length === 0 ? (
          <p className="text-richblack-600 font-medium">
            No pending complaints
          </p>
        ) : (
          <TableContainer component={Paper} className="rounded-2xl shadow-lg">
            <Table sx={{ minWidth: 1100 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#ECF5FF" }}>
                  <TableCell sx={headCell}>Room</TableCell>
                  <TableCell sx={headCell}>Student RegistrationNumber</TableCell>
                  <TableCell sx={headCell}>Description</TableCell>
                  <TableCell sx={headCell}>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {complaints.map((c) => (
                  <TableRow
                    key={c._id}
                    hover
                    sx={{ transition: "background-color 0.2s" }}
                  >
                    <TableCell sx={bodyCell}>
                      {c.student?.roomNumber}
                    </TableCell>

                    <TableCell sx={bodyCell}>
                      {c.student?.registrationNumber}
                    </TableCell>

                    <TableCell sx={bodyCell}>{c.description}</TableCell>

                    <TableCell sx={bodyCell}>
                      {updatingId === c._id ? (
                        <CircularProgress size={22} />
                      ) : (
                        <div className="relative">
                          {/* CURRENT STATUS */}
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusStyle(
                                c.status
                              )}`}
                            >
                              {c.status}
                            </span>

                            <button
                              onClick={() =>
                                setActiveRow(
                                  activeRow === c._id ? null : c._id
                                )
                              }
                              className="text-sm font-medium text-richblack-600 underline"
                            >
                              Change Status
                            </button>
                          </div>

                          {/* SLIDE ANIMATION STATUS OPTIONS */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out
                              ${
                                activeRow === c._id
                                  ? "max-h-20 opacity-100 mt-3"
                                  : "max-h-0 opacity-0"
                              }`}
                          >
                            <div className="flex gap-2">
                              {STATUSES.map((status) => (
                                <button
                                  key={status}
                                  disabled={status === c.status}
                                  onClick={() =>
                                    handleUpdateStatus(c._id, status)
                                  }
                                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all
                                    ${
                                      status === c.status
                                        ? "bg-richblack-800 text-white cursor-not-allowed"
                                        : "bg-richblack-25 text-richblack-600 hover:bg-richblack-50"
                                    }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <button
  className="text-blue-600 underline text-sm"
  onClick={() => navigate(`/supervisor/complaints/${c._id}`)}
>
  View
</button>


                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}

// ---------------- STYLES ----------------
const headCell = {
  fontSize: "1.05rem",
  fontWeight: 800,
  color: "#073B4C",
};

const bodyCell = {
  fontSize: "0.95rem",
  fontWeight: 500,
  color: "#2C333F",
};