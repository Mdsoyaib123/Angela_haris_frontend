// import { io, Socket } from "socket.io-client";

// let socket: Socket;

// export const connectSocket = (userId: string) => {
//   socket = io("https://angelaharris174-backend.onrender.com", {
//     query: { userId },
//   });

//   return socket;
// };

// export const getSocket = () => socket;

import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = (userId: string) => {
  socket = io("https://api.highlightzapp.com", {
    query: { userId },
  });

  // ✅ Listen for connection
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  // ❌ Listen for disconnect
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  // ⚠️ Listen for errors
  socket.on("connect_error", (err) => {
    console.log("🚨 Connection error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;
