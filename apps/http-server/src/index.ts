import express from "express";
import jwt from "jsonwebtoken";
import {
  LoginValidator,
  SignUpValidator,
} from "@repo/common-validation/validation";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./middleware/index";
import { prisma } from "@repo/db/client";

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

    // isnert into db
    const result = await prisma.user.create({
      data: {
        username,
        password,
        email,
      },
    });
    if (result) {
      const token = jwt.sign({ id: result.id }, JWT_SECRET);
      res.status(200).json({ token });
    } else {
      throw "Error while insering data";
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ message: "Wrong credentail type" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    LoginValidator.parse({ username, password });
    // db insert

    const result = await prisma.user.findFirst({ where: { username } });
    if (result) {
      const token = jwt.sign({ id: result.id }, JWT_SECRET);
      res.status(200).json({ token });
    } else {
      throw "No user found";
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ message: "Invalid cred" });
  }
});

app.get("/create", authMiddleware, (req, res) => {});
