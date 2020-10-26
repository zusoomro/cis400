import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");

  // check if it exists
  if (!token) {
    return res.status(401).json({ msg: "No token. Authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, "dummySecret") as {
      user: { id: string };
    };

    (req as AuthRequest).user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token." });
  }
};

export default auth;
