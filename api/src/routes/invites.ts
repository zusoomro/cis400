import express from "express";
import { isConstructorDeclaration } from "typescript";
import Pod from "../../models/Pod";
import PodInvites from "../../models/PodInvites";
import User from "../../models/User";
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

invitesRouter.post(
  "/accept",
  [auth],
  async (req: express.Request, res: express.Response) => {
    console.log("hit endpoint /invites/accept");
    try {
      const userId = (req as AuthRequest).user.id;
      const { podId, inviteId } = req.body;
      const numUpdated = await User.query().findById(userId).patch({
        podId: podId,
      });
      const numDeleted = await PodInvites.query().deleteById(inviteId);
      const acceptedPod = await Pod.query().findById(podId);
      res.send({ pod: acceptedPod });
    } catch (err) {
      console.log(err);
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
