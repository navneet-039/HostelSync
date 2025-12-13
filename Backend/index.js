const express = require("express");

const database = require("./Config/mongodb");
const app = express();
const userRoutes = require("./routes/User");
const complaintRoutes = require("./routes/complaint");
const supervisorRoutes = require("./routes/supervisor");




require("dotenv").config();

database.connect();
app.use(express.json());
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
app.use("/api/users", User);



