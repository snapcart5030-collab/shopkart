require("dotenv").config();
console.log("EMAIL:", process.env.EMAIL);
console.log("PASS:", process.env.PASS ? "OK" : "MISSING");

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 2050;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
