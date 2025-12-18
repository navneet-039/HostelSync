import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import Navbar from "../components/navbar";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function StudentRegisteredComplaint() {
  const { studentComplaints, dataLoading } = useContext(AppContext);

  if (dataLoading) {
    return <p className="text-center mt-24 text-xl text-richblack-500 font-inter">Loading complaints...</p>;
  }

  return (
    <div className="min-h-screen bg-richblack-5">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 font-inter">
        <h2 className="text-3xl sm:text-4xl font-semibold text-richblack-800 mb-8">My Complaints</h2>

        {studentComplaints.length === 0 ? (
          <p className="text-richblack-500 text-lg sm:text-xl">No registered complaints.</p>
        ) : (
          <TableContainer component={Paper} className="rounded-2xl shadow-lg overflow-x-auto">
            <Table sx={{ minWidth: 900 }} aria-label="student complaints table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#ECF5FF" }}>
                  <TableCell sx={headCell}>Title</TableCell>
                  <TableCell sx={headCell}>Description</TableCell>
                  <TableCell sx={headCell}>Category</TableCell>
                  <TableCell sx={headCell}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentComplaints.map((complaint) => (
                  <TableRow key={complaint._id} sx={{ "&:hover": { backgroundColor: "#F1F2FF" } }}>
                    <TableCell sx={bodyCell}>{complaint.title}</TableCell>
                    <TableCell sx={bodyCell}>{complaint.description}</TableCell>
                    <TableCell sx={bodyCell}>{complaint.category}</TableCell>
                    <TableCell sx={bodyCell}>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm sm:text-base font-semibold whitespace-nowrap ${
                          complaint.status === "Pending"
                            ? "bg-yellow-5 text-yellow-400"
                            : complaint.status === "In Progress"
                            ? "bg-blue-5 text-blue-400"
                            : "bg-caribbeangreen-5 text-caribbeangreen-400"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </TableCell>
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

const headCell = { fontSize: "1.1rem", fontWeight: 700, color: "#073B4C", whiteSpace: "nowrap" };
const bodyCell = { fontSize: "1rem", color: "#2C333F" };
