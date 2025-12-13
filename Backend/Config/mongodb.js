const mongoose = require("mongoose");
require("dotenv").config();
exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDb connected...."))
    .catch((error) => {
      console.log("Db connection failed");
      console.error(error);
      process.exit(1);
    });
};
