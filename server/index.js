import cors from "cors";
import express from "express";
import apiRoutes from "./routes/api.js"; // Import API routes

const app = express();

const corsOptions = {
  origin: "https://jasperrytech-main.github.io/BusRoute/", // Allow only this origin
  methods: "GET,POST,PUT,DELETE", // Optional: specify allowed methods
  allowedHeaders: "Content-Type,Authorization", // Optional: specify allowed headers
};

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.status(200).send("API is Online");
});

// Use the API routes
app.use("/api", apiRoutes);

export default app; // ES Module export
