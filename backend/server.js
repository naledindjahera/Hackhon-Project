const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Hackathon Project Backend is running!"
    });
});

// Projects API
app.get("/api/projects", (req, res) => {
    res.json([
        {
            id: 1,
            title: "Test Project",
            description: "This is our first project."
        }
    ]);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});