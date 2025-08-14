import { Server } from "http";
import mongoose from "mongoose";
import app from "./app.js";
import config from "./app/config/index.js";
import shutDown from "./app/utils/shutDown.js";
let server: Server;
async function main(): Promise<void> {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
    process.on("SIGTERM", () => {
      console.log("📦 SIGTERM received");
      shutDown(server);
    });

    process.on("SIGINT", () => {
      console.log("🧹 SIGINT (Ctrl+C) received");
      shutDown(server);
    });
    process.on("unhandledRejection", (reason) => {
      console.error("💥 Unhandled Rejection:", reason);
      shutDown(server);
    });
    process.on("uncaughtException", (err) => {
      console.log("💣 uncaught Exception", err);
      shutDown(server);
    });
  } catch (error) {
    console.error(" Failed to connect to the database", error);
  }
}
void main();
