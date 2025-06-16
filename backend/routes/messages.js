// backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const auth = require("../middleware/authMiddleware");

router.get("/:projectId", auth, async (req, res) => {
  try {
    const messages = await Message.find({ projectId: req.params.projectId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Ошибка загрузки сообщений" });
  }
});

module.exports = router;
