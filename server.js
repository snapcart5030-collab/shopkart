require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

// ================== DB CONNECT ==================
connectDB();

const PORT = process.env.PORT || 2050;

// ================== CREATE HTTP SERVER ==================
const server = http.createServer(app);

// ================== SOCKET.IO SETUP ==================
const io = new Server(server, {
  cors: {
    origin: "*", // later you can restrict to frontend URL
    methods: ["GET", "POST"]
  }
});

// ================== SOCKET CONNECTION ==================
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

    // 📍 DELIVERY BOY SENDS LIVE LOCATION
  socket.on("deliveryLocationUpdate", ({ orderId, lat, lng }) => {
    if (!orderId || !lat || !lng) return;

    const roomName = `order_${orderId}`;

    // emit to user in same order room
    io.to(roomName).emit("locationUpdate", {
      lat,
      lng,
      updatedAt: new Date()
    });
  });


  // 🔗 JOIN ORDER ROOM (USER / DELIVERY BOY)
  socket.on("joinOrderRoom", ({ orderId, userId, role }) => {
    if (!orderId || !role) return;

    const roomName = `order_${orderId}`;
    socket.join(roomName);

    console.log(
      `👥 ${role} (${userId || "unknown"}) joined room ${roomName}`
    );

    // notify other person in same order
    socket.to(roomName).emit("userJoined", {
      role,
      message: `${role} joined order room`
    });
  });

  // 🚪 LEAVE ORDER ROOM (OPTIONAL)
  socket.on("leaveOrderRoom", ({ orderId }) => {
    if (!orderId) return;

    const roomName = `order_${orderId}`;
    socket.leave(roomName);

    console.log(`🚪 Socket left room ${roomName}`);
  });

  // 🔴 DISCONNECT
  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ================== START SERVER ==================
server.listen(PORT, () => {
  console.log(
    `🚀 Server + Socket.io running at http://localhost:${PORT}`
  );
});

// ================== EXPORT IO ==================
// (needed later for emitting events from controllers)
module.exports = { io };
