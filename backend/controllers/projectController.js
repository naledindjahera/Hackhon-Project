const projects = require("../data/projects");

const getProjects = (req, res) => {
    const { search, category } = req.query;

    let filteredProjects = projects;

    if (search) {
        const searchTerm = search.toLowerCase();

        filteredProjects = filteredProjects.filter(project =>
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm)
        );
    }

    if (category) {
        filteredProjects = filteredProjects.filter(project =>
            project.category.toLowerCase() === category.toLowerCase()
        );
    }

    res.json(filteredProjects);
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

const voteForProject = (req, res) => {
    const id = parseInt(req.params.id);

    const project = projects.find(project => project.id === id);

    if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    project.votes += 1;

    res.json({
        message: "Vote recorded successfully",
        projectId: project.id,
        votes: project.votes
    });
};

const getProjectVotes = (req, res) => {
    const id = parseInt(req.params.id);

    const project = projects.find(project => project.id === id);

    if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    res.json({
        projectId: project.id,
        votes: project.votes
    });
};


const getProjectRankings = (req, res) => {
    const rankedProjects = [...projects].sort((a, b) => b.votes - a.votes);

    res.json(rankedProjects);
};

const getCategories = (req, res) => {
    const categories = [...new Set(projects.map(project => project.category))];

    res.json(categories);
};


module.exports = {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    voteForProject,
    getProjectVotes,
    getProjectRankings,
    getCategories
};