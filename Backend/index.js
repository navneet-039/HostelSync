import express from "express";
import dotenv from "dotenv";
import { connect } from "./Config/mongodb.js";

import userRoutes from "./routes/User.js";
import complaintRoutes from "./routes/complaint.js";
import supervisorRoutes from "./routes/supervisor.js";

dotenv.config();

const app = express();

app.use(express.json());

connect();

app.get("/", (req, res) => {
  res.send("Server is running ...");
});

app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/supervisor", supervisorRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
