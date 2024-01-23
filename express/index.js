const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint for handling recording file uploads
app.post("/api/upload", upload.single("recording"), (req, res) => {
  // Simulate random processing time (replace this with your actual processing logic)
  const processingTime = Math.floor(Math.random() * 5000) + 1000; // Between 1 to 5 seconds
  setTimeout(() => {
    res.json({ status: "Done" });
  }, processingTime);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
