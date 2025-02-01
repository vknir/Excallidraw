import { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
const wss = new WebSocketServer({ port: 5000 });

wss.on("connection", (ws, request) => {
  ws.send("ping");

  const url = request.url;
  if (!url) return;

  const searchParams = new URL(url)
  const token = searchParams.searchParams.get("token") || "";

  const decoded = jwt.verify(token, JWT_SECRET);
});
