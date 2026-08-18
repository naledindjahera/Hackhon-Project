const express = require("express");
const router = express.Router();

const {
    getProjects,
    createProject,
    getProjectById,
    updateProject
} = require("../controllers/projectController");

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);

module.exports = router;