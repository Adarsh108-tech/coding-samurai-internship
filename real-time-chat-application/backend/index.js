require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { saveMessage } = require("./controllers/messageController");
const authMiddleware = require("./middelware/authMiddelware");

const app = express();
const server = http.createServer(app);

// ✅ Correct CORS config
const corsOptions = {
  origin: "https://welp-2-0.vercel.app", // Replace with your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ CORS middleware
app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", authMiddleware, require("./routes/userRoutes"));
app.use("/group", authMiddleware, require("./routes/groupRoutes"));

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "https://welp-2-0.vercel.app", // Match frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// User ↔ Socket map
const userSocketMap = new Map(); // userId -> socket.id

io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);

  socket.on("join", (userId) => {
    if (!userId) return;
    userSocketMap.set(userId, socket.id);
    socket.join(userId);
    console.log(`✅ User ${userId} joined personal room`);
  });

  socket.on("send-message", async (data) => {
    const savedMessage = await saveMessage(data);

    if (!savedMessage) {
      return socket.emit("error-message", {
        message: "Failed to save message",
        original: data,
      });
    }

    const { sender_id, receiver_id, is_group } = savedMessage;

    if (is_group) {
      const roomName = `group_${receiver_id}`;
      io.to(roomName).emit("receive-message", savedMessage);
      console.log(`📤 Group message sent to room ${roomName}`);
    } else {
      io.to(receiver_id).emit("receive-message", savedMessage);
      io.to(sender_id).emit("receive-message", savedMessage);
      console.log(`📤 DM sent to ${receiver_id} and ${sender_id}`);
    }
  });

  socket.on("join-group", (groupId) => {
    const room = `group_${groupId}`;
    socket.join(room);
    console.log(`➕ Joined group room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    for (let [userId, sockId] of userSocketMap.entries()) {
      if (sockId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
