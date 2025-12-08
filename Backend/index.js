const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Server is running ...");
});
const PORT = process.env.PORT||8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
