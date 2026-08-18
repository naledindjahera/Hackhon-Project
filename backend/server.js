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


// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint not found"
    });
});


// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: "Internal server error"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});