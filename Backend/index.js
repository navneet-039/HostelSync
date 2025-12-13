const express = require("express");

const database = require("./Config/mongodb");
const app = express();


require("dotenv").config();


app.get("/", (req, res) => {
  res.send("Server is running ...");
});
const PORT = process.env.PORT || 8001;
database.connect();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
