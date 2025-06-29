import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);

// this returns the `io` instance; keep if you need it later
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
  try {
    const uri = process.env.MONGO_URI ||
      "mongodb+srv://singhrathoredeepak661:Deepak%40123@cluster0.zwvewxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`Server listening on port ${app.get("port")}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

start();
