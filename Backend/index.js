const express = require("express");

const database = require("./Config/mongodb");
const app = express();
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const complaintQueryRoutes = require("./routes/complaintQueryRoutes");




require("dotenv").config();


app.get("/", (req, res) => {
  res.send("Server is running ...");
});
const PORT = process.env.PORT || 8001;
database.connect();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/complaints", complaintQueryRoutes);

