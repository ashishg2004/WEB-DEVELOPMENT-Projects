const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());

// Dummy data for EV charging stations
const stations = [
  { name: "Station 1", address: "123 Main St", lat: 37.7749, lng: -122.4194 },
  { name: "Station 2", address: "456 Market St", lat: 37.7849, lng: -122.4094 },
  { name: "Station 3", address: "789 Mission St", lat: 37.7649, lng: -122.4294 },
];

// Endpoint to get charging station data
app.get("/stations", (req, res) => {
  res.json(stations);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
