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

    // ================== WEB RTC CALLING EVENTS ==================
    // Register user mapping
    socket.on("register-user", ({ userId }) => {
      socket.userId = userId;
      console.log(`👤 User registered: ${userId} (socket: ${socket.id})`);
    });

    // Call invitation
    socket.on("call-user", ({ to, offer, callType, callerName }) => {
      console.log(`📞 Call from ${socket.userId} to ${to} (${callType})`);
      socket.callingUser = to;

      // Find callee socket
      const clients = io.sockets.sockets;
      let targetSocket = null;
      for (const [id, s] of clients.entries()) {
        if (s.userId === to) {
          targetSocket = s;
          break;
        }
      }

      if (targetSocket) {
        targetSocket.emit("incoming-call", {
          from: socket.userId,
          offer,
          callType,
          callerName
        });
      } else {
        socket.emit("call-rejected", { reason: "User offline" });
      }
    });

    // Answer call
    socket.on("accept-call", ({ to, answer }) => {
      console.log(`💚 Accept call from ${socket.userId} to ${to}`);
      socket.callingUser = to;

      const clients = io.sockets.sockets;
      let targetSocket = null;
      for (const [id, s] of clients.entries()) {
        if (s.userId === to) {
          targetSocket = s;
          break;
        }
      }

      if (targetSocket) {
        targetSocket.emit("call-accepted", {
          answer
        });
      }
    });

    // Reject call
    socket.on("reject-call", ({ to }) => {
      console.log(`❌ Reject call from ${socket.userId} to ${to}`);
      socket.callingUser = null;

      const clients = io.sockets.sockets;
      let targetSocket = null;
      for (const [id, s] of clients.entries()) {
        if (s.userId === to) {
          targetSocket = s;
          break;
        }
      }

      if (targetSocket) {
        targetSocket.emit("call-rejected");
      }
    });

    // End call
    socket.on("end-call", ({ to }) => {
      console.log(`🛑 End call from ${socket.userId} to ${to}`);
      socket.callingUser = null;

      const clients = io.sockets.sockets;
      let targetSocket = null;
      for (const [id, s] of clients.entries()) {
        if (s.userId === to) {
          targetSocket = s;
          break;
        }
      }

      if (targetSocket) {
        targetSocket.emit("call-ended");
      }
    });

    // ICE Candidates exchange
    socket.on("ice-candidate", ({ to, candidate }) => {
      const clients = io.sockets.sockets;
      let targetSocket = null;
      for (const [id, s] of clients.entries()) {
        if (s.userId === to) {
          targetSocket = s;
          break;
        }
      }

      if (targetSocket) {
        targetSocket.emit("ice-candidate", {
          candidate
        });
      }
    });

    // 🔴 DISCONNECT
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
      if (socket.callingUser) {
        const clients = io.sockets.sockets;
        for (const [id, s] of clients.entries()) {
          if (s.userId === socket.callingUser) {
            s.emit("call-ended");
            s.callingUser = null;
            break;
          }
        }
      }
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
