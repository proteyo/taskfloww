const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// WebSocket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
  },
});
const setupSocket = require("./socket");
setupSocket(io);

// Middleware
app.use(cors());
app.use(express.json());
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/chat", require("./routes/messages")); // ✅ добавили маршрут для чата

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Проверка
app.get("/", (req, res) => {
  res.send("Backend работает!");
});

// Запуск
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Сервер с WebSocket запущен на порту ${PORT}`)
);
