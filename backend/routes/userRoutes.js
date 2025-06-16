const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // путь может отличаться

// 🔄 Обновление аватара
router.put("/avatar", authMiddleware, async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: "Аватар обязателен" });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user);
  } catch (err) {
    console.error("Ошибка при обновлении аватара:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
