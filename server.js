const express = require("express");
const cors = require("cors");
const generateResponse = require("./services/ai.service");

const app = express();


app.use(
  cors({
    origin: "https://ai-chatbot-nu-rose-66.vercel.app",
    methods: ["GET", "POST"],
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use(express.json());

// HTTP server + Socket.io
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://ai-chatbot-nu-rose-66.vercel.app",
    methods: ["GET", "POST"],
  },
});

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", () => {
    console.log("Message received from client");
  });

  socket.on("ai-res", async (data) => {
    try {
      console.log("User message:", data);

      // Push user query
      chatHistory.push({
        role: "user",
        parts: [{ text: data }],
      });

      // Generate reply
      const result = await generateResponse(chatHistory);

      // Push model reply
      chatHistory.push({
        role: "model",
        parts: [{ text: result }],
      });

      console.log("AI Response:", result);

      // Emit response back to frontend
      socket.emit("ai-response", { result });
    } catch (error) {
      console.error("AI ERROR:", error.message);
      socket.emit("ai-error", { error: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});