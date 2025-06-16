// backend/socket.js
const Message = require("./models/Message");

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("📡 Пользователь подключён:", socket.id);

    // Вход в комнату проекта
    socket.on("joinProject", (projectId) => {
      socket.join(projectId);
      console.log(`🔗 Пользователь вошёл в комнату проекта: ${projectId}`);
    });

    // Отправка сообщения
    socket.on("sendMessage", async ({ projectId, userId, text }) => {
      if (!text?.trim()) return;

      const message = await Message.create({ projectId, sender: userId, text });

      const populated = await message.populate("sender", "name");

      // Отправка сообщения всем в комнате
      io.to(projectId).emit("newMessage", {
        _id: message._id,
        text: message.text,
        sender: { _id: populated.sender._id, name: populated.sender.name },
        createdAt: message.createdAt,
      });
    });
  });
}

module.exports = setupSocket;
