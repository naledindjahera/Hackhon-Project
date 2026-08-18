const express = require("express");
const router = express.Router();

const {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    voteForProject,
    getProjectVotes,
    getProjectRankings
} = require("../controllers/projectController");

router.get("/", getProjects);
router.post("/", createProject);

router.get("/rankings", getProjectRankings);


router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

router.post("/:id/vote", voteForProject);
router.get("/:id/votes", getProjectVotes);

module.exports = router;