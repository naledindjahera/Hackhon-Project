const projects = require("../data/projects");

const getProjects = (req, res) => {
    res.json(projects);
};

module.exports = {
    getProjects
};