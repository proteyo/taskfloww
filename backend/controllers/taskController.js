const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, project } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      createdBy: req.userId,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при создании задачи", error: err.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при загрузке задач", error: err.message });
  }
};

// Участник принимает задачу
exports.assignToSelf = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Задача не найдена" });

    task.assignedTo = req.userId;
    task.status = "in_progress";
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Ошибка принятия задачи", error: err.message });
  }
};

// Участник отправляет решение
exports.submitSolution = async (req, res) => {
  try {
    const { solutionText } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Задача не найдена" });

    if (task.assignedTo?.toString() !== req.userId)
      return res.status(403).json({ message: "Нельзя отправить чужую задачу" });

    task.solutionText = solutionText;
    task.submitted = true;
    task.status = "review";
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Ошибка отправки решения", error: err.message });
  }
};

// Менеджер одобряет
exports.approveTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Задача не найдена" });

    task.status = "done";
    task.submitted = false;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при одобрении", error: err.message });
  }
};

// Менеджер возвращает на доработку
exports.rejectTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { status: "in_progress", submitted: false, feedback },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при возврате задачи", error: err.message });
  }
};


