import React, { useContext, useState } from "react";
import { SupervisorContext } from "../context/SupervisorContext";
import Navbar from "../components/navbar";
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
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-richblack-25 text-richblack-700";
      case "In_progress":
        return "bg-richblack-50 text-richblack-800";
      case "Resolved":
        return "bg-richblack-100 text-richblack-900";
      default:
        return "";
    }
  };

  if (dataLoading) {
    return (
      <p className="text-center mt-24 text-xl font-medium">
        Loading complaints...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-5">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8">
          Hostel Complaints
        </h2>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>Reg. Number</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {complaints.map((c) => (
                <TableRow key={c._id} hover>
                  <TableCell>{c.student?.roomNumber}</TableCell>
                  <TableCell>{c.student?.registrationNumber}</TableCell>
                  <TableCell>{c.description}</TableCell>

                  <TableCell>
                    {updatingId === c._id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
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
                          className="ml-3 underline text-sm"
                        >
                          Change
                        </button>

                        {activeRow === c._id && (
                          <div className="mt-2 flex gap-2">
                            {STATUSES.map((s) => (
                              <button
                                key={s}
                                disabled={s === c.status}
                                onClick={() =>
                                  handleUpdateStatus(c._id, s)
                                }
                                className="text-sm underline"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </TableCell>

                  <TableCell>
                    <button
                      onClick={() =>
                        navigate(`/supervisor/complaints/${c._id}`)
                      }
                      className="text-blue-600 underline"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
