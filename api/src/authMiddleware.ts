import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user: {
    id: number;
  };
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");

  // check if it exists
  if (!token) {
    return res.status(401).json({ message: "No token. Authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, "dummySecret") as {
      user: { id: number };
    };

    (req as AuthRequest).user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export default auth;
