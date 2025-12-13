const express = require("express");

const database = require("./Config/mongodb");
const app = express();
const userRoutes = require("./routes/User");
const complaintRoutes = require("../routes/complaint");
const complaintQueryRoutes = require("./routes/supervisor");




require("dotenv").config();


app.get("/", (req, res) => {
  res.send("Server is running ...");
});
const PORT = process.env.PORT || 8001;
database.connect();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use("/api/users", User);



