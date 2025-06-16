const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Нет токена. Доступ запрещён." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.id;
    req.userRole = decoded.role;

    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Пользователь не найден" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Неверный токен", error: err.message });
  }
};

module.exports = authMiddleware;
