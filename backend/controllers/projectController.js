const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newProject = await Project.create({
      title,
      description,
      createdBy: req.userId,
      members: [req.userId],
    });
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при создании проекта", error: err.message });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
const projects = await Project.find({ members: req.userId })
.populate("createdBy", "name")
.populate("members", "name")
  .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при загрузке проектов", error: err.message });
  }
};

// Получить проекты, где пользователь НЕ участник
exports.getAvailableProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: { $ne: req.userId },
    })
.populate("createdBy", "name")
.populate("members", "name")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении доступных проектов" });
  }
};

// Вступить в проект
exports.joinProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Проект не найден" });

    if (!project.members.includes(req.userId)) {
      project.members.push(req.userId);
      await project.save();
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при вступлении в проект" });
  }
};

// Проекты, где участник уже состоит
exports.getMyMemberProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.userId,
    })
      .populate("createdBy", "name")
      .populate("members", "name")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении ваших проектов" });
  }
};
