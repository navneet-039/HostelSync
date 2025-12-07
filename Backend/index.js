const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
  res.send("Server is running ...");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
