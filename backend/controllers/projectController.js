const projects = require("../data/projects");

const getProjects = (req, res) => {
    res.json(projects);
};

const createProject = (req, res) => {
    const newProject = {
        id: projects.length + 1,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        githubUrl: req.body.githubUrl,
        demoUrl: req.body.demoUrl
    };

    projects.push(newProject);

    res.status(201).json(newProject);
};

module.exports = {
    getProjects,
    createProject
};