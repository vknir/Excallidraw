import jwt from "jsonwebtoken";
import { WebSocketServer, WebSocket } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });
interface User {
  ws: WebSocket;
  room: string[];
  userId: string;
}

const allUsers: User[] = [];

function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") return null;

    if (!decoded.id) {
      return null;
    }
    return decoded.id;
  } catch (e) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const parameters = new URLSearchParams(url.split("?")[1]);
  const token = parameters.get("token");

  if (!token) {
    ws.close();
    return;
  }

  const userId = verifyToken(token);
  if (!userId) {
    ws.close();
    return;
  }

  allUsers.push({ ws: ws, userId, room: [] });

  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data.toString());
    const currentUser = allUsers.find((x) => x.ws === ws);
    if (!currentUser) {
      ws.close();
      return;
    }
    switch (parsedData.type) {
      case "join_room":
        currentUser?.room.push(parsedData.roomId);
        break;
      case "leave_room":
        currentUser.room = currentUser?.room.filter(
          (x) => x != parsedData.roomId
        );
        break
      case "chat":
        const currentRoomId = parsedData.roomId;
        const currentMessage = parsedData.message;

        await prisma.chats.create({
          data: {
            roomId: currentRoomId,
            message: currentMessage,
            userId : currentUser.userId,
          },
        });

        allUsers.forEach((user) => {
          if (user.room.includes(currentRoomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message: parsedData.message,
                roomId: currentRoomId,
              })
            );
          }
        });
        break
    }
  });
});
