import express from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth, { AuthRequest } from "../authMiddleware";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  const response = await User.query();
  res.json(response);
});

usersRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill out both fields." });
  }

  if (password.length < 5) {
    return res.status(400).json({
      message: "Please provide a password that is at least 5 characters long",
    });
  }

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(email.toLowerCase())) {
    return res.status(400).json({
      message: "Please provide a valid email",
    });
  }

  try {
    const existingUser = await User.query().where("email", email);

    if (existingUser.length) {
      console.error(
        `Error at POST /users: User with email '${email}' already exists`
      );
      res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.query().insert({
      email,
      password: hashedPassword,
    });

    console.log(`Creating user with email '${email}'`);

    jwt.sign(
      {
        user: {
          id: user.id,
        },
      },
      "dummySecret",
      { expiresIn: "2 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err);
  }
});

usersRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let userArray = await User.query().where("email", email);

    if (!userArray.length) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const user = userArray[0];

    // Compare the given password to the user's password.
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return the jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, "dummySecret", { expiresIn: "2 days" }, (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

usersRouter.get(
  "/loadUser",
  [auth],
  async (req: express.Request, res: express.Response) => {
    try {
      const userList = await User.query().where(
        "id",
        (req as AuthRequest).user.id
      );
      const firstUser = userList[0];
      res.json({ user: firstUser });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

export default usersRouter;
