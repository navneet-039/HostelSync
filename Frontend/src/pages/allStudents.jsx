import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import toast from "react-hot-toast";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

export default function SupervisorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/supervisor/Allstudent");

      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (error) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-5">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-richblack-900">
          Hostel Students
        </h2>

        {students.length === 0 ? (
          <p className="text-richblack-600 font-medium">No students found</p>
        ) : (
          <TableContainer
            component={Paper}
            className="rounded-2xl shadow-lg overflow-x-auto"
          >
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#ECF5FF" }}>
                  <TableCell sx={headCell}>Name</TableCell>
                  <TableCell sx={headCell}>Email</TableCell>
                  <TableCell sx={headCell}>Phone</TableCell>
                  <TableCell sx={headCell}>Reg. No</TableCell>
                  <TableCell sx={headCell}>Room</TableCell>
                  <TableCell sx={headCell}>Floor</TableCell>
                  <TableCell sx={headCell}>Branch</TableCell>
                  <TableCell sx={headCell}>Year</TableCell>
                  <TableCell sx={headCell}>Hostel</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student._id}
                    hover
                    sx={{ transition: "background-color 0.2s" }}
                  >
                    <TableCell sx={bodyCell}>{student.name}</TableCell>
                    <TableCell sx={bodyCell}>{student.email}</TableCell>
                    <TableCell sx={bodyCell}>{student.phone}</TableCell>
                    <TableCell sx={bodyCell}>{student.registrationNumber}</TableCell>
                    <TableCell sx={bodyCell}>{student.roomNumber}</TableCell>
                    <TableCell sx={bodyCell}>{student.floor || "-"}</TableCell>
                    <TableCell sx={bodyCell}>{student.branch}</TableCell>
                    <TableCell sx={bodyCell}>{student.year}</TableCell>
                    <TableCell sx={bodyCell}>
                      {student.hostel?.name || "-"}
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

// ---------------- STYLES ----------------
const headCell = {
  fontSize: "1rem",
  fontWeight: 700,
  color: "#073B4C",
};

const bodyCell = {
  fontSize: "0.95rem",
  fontWeight: 500,
  color: "#2C333F",
};
