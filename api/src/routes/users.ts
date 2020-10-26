import express from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth, { AuthRequest } from "../authMiddleware";

let usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  const response = await User.query();
  res.json(response);
});

usersRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.query().where("email", email);

    if (existingUser.length) {
      console.error(
        `Error at POST /users: User with email '${email}' already exists`
      );
      res.status(400).json({ errors: [{ msg: "User already exists" }] });
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
      { expiresIn: 360000 },
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
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid credentials." }] });
    }

    const user = userArray[0];

    // Compare the given password to the user's password.
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid credentials." }] });
    }

    // Return the jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, "dummySecret", { expiresIn: 900 }, (err, token) => {
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
      const user = await User.query().where("id", (req as AuthRequest).user.id);

      console.log("request.user", (req as AuthRequest).user);
      console.log("user", user);

      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

export default usersRouter;
