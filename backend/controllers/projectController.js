const projects = require("../data/projects");

const getProjects = (req, res) => {
    res.json(projects);
};

const createProject = (req, res) => {
    const {
        title,
        description,
        category,
        githubUrl,
        demoUrl
    } = req.body;

    if (!title || !description || !category) {
        return res.status(400).json({
            message: "Title, description and category are required"
        });
    }

    const newProject = {
        id: projects.length + 1,
        title,
        description,
        category,
        githubUrl: githubUrl || "",
        demoUrl: demoUrl || ""
    };

    projects.push(newProject);

    res.status(201).json(newProject);
};

const getProjectById = (req, res) => {
    const id = parseInt(req.params.id);

    const project = projects.find(project => project.id === id);

    if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    res.json(project);
};

const updateProject = (req, res) => {
    const id = parseInt(req.params.id);

    const project = projects.find(project => project.id === id);

    if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    project.title = req.body.title ?? project.title;
    project.description = req.body.description ?? project.description;
    project.category = req.body.category ?? project.category;
    project.githubUrl = req.body.githubUrl ?? project.githubUrl;
    project.demoUrl = req.body.demoUrl ?? project.demoUrl;

    res.json(project);
};

const deleteProject = (req, res) => {
    const id = parseInt(req.params.id);

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex === -1) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    const deletedProject = projects.splice(projectIndex, 1);

    res.json({
        message: "Project deleted successfully",
        project: deletedProject[0]
    });
};


module.exports = {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject
};