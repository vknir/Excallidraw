import express from "express";
import jwt from "jsonwebtoken";
import {
  LoginValidator,
  SignUpValidator,
  RoomValidator,
} from "@repo/common-validation/validation";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware/index";
import { prisma } from "@repo/db/client";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
app.use(express.json());

app.listen(port, () => {
  console.log(`server running on port ${3000}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello" });
});

app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    SignUpValidator.parse({ username, password, email });

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) throw err;

      try {
        const result = await prisma.user.create({
          data: {
            username,
            password: hash,
            email,
          },
        });

        if (result.id) {
          const token = jwt.sign({ id: result.id }, JWT_SECRET);
          res.status(200).json({ token });
        } else {
          throw "Error while insering data";
        }
      } catch (e) {
        console.log(e);
        res.status(401).json({ message: "username taken" });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(401).json({ message: "Wrong credentail type" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    LoginValidator.parse({ username, password });

    const dbUser = await prisma.user.findUnique({ where: { username } });
    if (dbUser?.id) {
      bcrypt.compare(password, dbUser.password, (err, result) => {
        if (err) throw "Cannot hash password";
        if (result) {
          const token = jwt.sign({ id: dbUser.id }, JWT_SECRET);
          res.status(200).json({ token });
        } else {
          res.status(401).json({ message: "wrong cred" });
        }
      });
    } else {
      throw "No user found";
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ message: "Invalid cred" });
  }
});

app.post("/create", authMiddleware, async (req, res) => {
  const { name } = req.body;
  try {
    RoomValidator.parse({ name });

    const userId = req.userId;
    if (userId) {
      try {
        const result = await prisma.room.create({
          data: {
            slug: name,
            adminId: userId,
          },
        });

        if (result)
          res
            .status(200)
            .json({ message: "room created successfully", roomId: result.id });
        else res.status(411).json({ message: "room could not be created" });
      } catch (e) {
        res.status(401).json({ message: "Room already exists" });
      }
    }
  } catch (e) {
    res.status(401).json({ message: "room code invalid" });
  }
});
