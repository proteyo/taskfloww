const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  assignToSelf,
  submitSolution,
  approveTask,
  rejectTask,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

// Создание задачи
router.post("/", authMiddleware, createTask);

// Получение задач по проекту
router.get("/:projectId", authMiddleware, getTasksByProject);

// Участник принимает задачу
router.patch("/assign/:id", authMiddleware, assignToSelf);

// Участник отправляет решение
router.patch("/submit/:id", authMiddleware, submitSolution);

// Менеджер одобряет задачу
router.patch("/approve/:id", authMiddleware, approveTask);

// Менеджер возвращает задачу на доработку
router.patch("/reject/:id", authMiddleware, rejectTask);

module.exports = router;
