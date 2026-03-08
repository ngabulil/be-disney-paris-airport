const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const locationRoutes = require("./routes/locationRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const tripRoutes = require("./routes/tripRoutes");
const pricingVehicleRoutes = require("./routes/pricingVehicleRoutes");
const articleRoutes = require("./routes/articleRoutes");

env.config();

app.use(express.json());
app.use(cors());

app.use("/api/admin", adminRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/pricingVehicle", pricingVehicleRoutes);
app.use("/api/article", articleRoutes);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server running on port:", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("MongoDB error:", err.message);
  });