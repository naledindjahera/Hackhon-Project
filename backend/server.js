const express = require("express");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "Hackathon Project Backend is running!"
    });
});

app.use("/api/projects", projectRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});