const express = require("express");
const router = express.Router();
const {
  createProject,
  getMyProjects,
    getMyMemberProjects,
  getAvailableProjects,
  joinProject,
} = require("../controllers/projectController");const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getMyProjects);
router.get("/available", authMiddleware, getAvailableProjects);
router.patch("/join/:id", authMiddleware, joinProject);
router.get("/my", authMiddleware, getMyMemberProjects);


module.exports = router;
