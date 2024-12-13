import cors from "cors";
import express from "express";
import apiRoutes from "./routes/api.js"; // Importing the API routes

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json()); // Use .json() for parsing incoming JSON bodies
app.use(cors());

// Use the API routes
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
