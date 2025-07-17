require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { saveMessage } = require("./controllers/messageController");
const authMiddleware = require('./middelware/authMiddelware');

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with frontend origin in prod
    methods: ["GET", "POST"]
  }
});
const corsOptions = {
  origin: "*", // 👈 frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // if you're using cookies (optional)
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", authMiddleware, require("./routes/userRoutes"));
app.use("/group", authMiddleware, require("./routes/groupRoutes"));

// User → Socket map
const userSocketMap = new Map(); // userId -> socket.id

// Socket.IO
io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);

  // On join, user provides their userId
  socket.on("join", (userId) => {
    if (!userId) return;

    // Track user socket
    userSocketMap.set(userId, socket.id);

    // Join personal room
    socket.join(userId);
    console.log(`✅ User ${userId} joined personal room`);

    // Optional: Join group rooms too (if you want to emit history later)
  });

  socket.on("send-message", async (data) => {
    // Expected: { sender_id, receiver_id, content, is_group }

    const savedMessage = await saveMessage(data);

    if (!savedMessage) {
      return socket.emit("error-message", {
        message: "Failed to save message",
        original: data
      });
    }

    const { sender_id, receiver_id, is_group } = savedMessage;

    if (is_group) {
      // Emit to group room
      const roomName = `group_${receiver_id}`;
      io.to(roomName).emit("receive-message", savedMessage);
      console.log(`📤 Group message sent to room ${roomName}`);
    } else {
      // 1:1: Emit to both sender and receiver personal rooms
      io.to(receiver_id).emit("receive-message", savedMessage);
      io.to(sender_id).emit("receive-message", savedMessage); // Echo for sender too
      console.log(`📤 DM sent to ${receiver_id} and ${sender_id}`);
    }
  });

  // Let users join group rooms manually
  socket.on("join-group", (groupId) => {
    const room = `group_${groupId}`;
    socket.join(room);
    console.log(`➕ Joined group room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    // Remove user from map
    for (let [userId, sockId] of userSocketMap.entries()) {
      if (sockId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
