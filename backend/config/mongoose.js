const mongoose = require("mongoose");

const dbname = process.env.DB;

mongoose
  .connect(`mongodb://127.0.0.1/${dbname}`)
  .then(() => console.log(`Connected to database ${dbname}`))
  .catch((err) => console.log("Database connection error:", err));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

module.exports = mongoose;
