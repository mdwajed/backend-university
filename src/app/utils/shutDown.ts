import { Server } from "http";

export default function shutDown(server: Server) {
  server.close(() => {
    console.log("🔒 Server closed");
    process.exit(1);
  });
}
