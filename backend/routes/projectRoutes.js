const express = require("express");
const router = express.Router();

const {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;