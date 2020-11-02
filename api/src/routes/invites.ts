import express from "express";
import { isConstructorDeclaration } from "typescript";
import PodInvites from "../../models/PodInvites";
import auth, { AuthRequest } from "../authMiddleware";

let invitesRouter = express.Router();

invitesRouter.get(
  "/currUsersInvites",
  [auth],
  async (req: express.Request, res: express.Response) => {
    try {
      console.log("hit endpoint /invites/currUsersInvites");
      const userId = (req as AuthRequest).user.id;
      const invitesList = await PodInvites.query().where(
        "inviteeUserId",
        userId
      );

      res.json({ invites: invitesList });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

invitesRouter.post("/reject", async (req, res) => {
  const { id } = req.body;
  try {
    const numDeleted = await PodInvites.query().deleteById(id);
    res.send({ msg: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default invitesRouter;
