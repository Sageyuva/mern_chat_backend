const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIO = require("socket.io");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
dotenv.config();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Database Connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Server is Connected to Database");
  } catch (err) {
    console.log("Server is NOT connected to Database", err.message);
  }
};
connectDb();

// API Root
app.get("/", (req, res) => {
  res.send("API is running123");
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// Server Setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});

// Socket.io Setup
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 6000,
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user.data._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageStatus) => {
    const chat = newMessageStatus.chat;
    if (!chat.users) {
      return console.log("chat user not defined");
    }

    // Assuming newMessageReceived is defined somewhere in your code
    socket.in(user.id).emit("message received", newMessageReceived);
  });
});
