import express from "express";
import { UserSchemaValidation } from "@repo/validation/validation";
import { JWT_SECRET } from "@repo/backend/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`servers running on port ${port}`);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    UserSchemaValidation.parse({ username, password });

    // check for username if found check match password
    const userID = "1";
    const hashedPassword = "";
    const result = await bcrypt.compare(password, hashedPassword);
    if (result) {
      const token = jwt.sign({ id: userID }, JWT_SECRET);
      res.status(200).json({
        token,
      });
    } else {
      throw "Invalid creds";
    }
  } catch (e) {
    console.log(e);
    res.status(403).json({
      message: "Invalid creds for login",
    });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    UserSchemaValidation.parse({ username, password });

    bcrypt.hash(password, 5, (err, hash) => {
      if (err) {
        throw err;
      } else {
        // store password in db
        const userID = "1";
        const token = jwt.sign({ id: userID }, JWT_SECRET);
        res.status(200).json({
          token,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(403).json({ messgae: "Username already in use" });
  }
});
