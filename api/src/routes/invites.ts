import express from "express";
import { isConstructorDeclaration } from "typescript";
import Pod from "../../models/Pod";
import PodInvites from "../../models/PodInvites";
import User from "../../models/User";
import auth, { AuthRequest } from "../authMiddleware";

let invitesRouter = express.Router();

invitesRouter.get(
  "/",
  [auth],
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as AuthRequest).user.id;
      const invitesList = await PodInvites.query().where(
        "inviteeUserId",
        userId
      );

      const invitesToReturn: Array<Object> = [];

      async function getPodNameForInvite(invitesList: PodInvites[]) {
        for (const invite of invitesList) {
          const podName = (await Pod.query().findById(invite.podId)).name;
          const newInvite = {
            id: invite.id,
            inviterUserId: invite.inviterUserId,
            inviteeUserId: invite.inviteeUserId,
            podId: invite.podId,
            podName: podName,
          };
          invitesToReturn.push(newInvite);
        }
      }

      // console.log(
      //   "async function invitesToReturn",
      //   await getPodNameForInvite(invitesList)
      // );
      await getPodNameForInvite(invitesList);
      res.json({ invites: invitesToReturn });
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

      const pod = (await Pod.query().where("id", podId))[0];

      if (!pod) {
        console.log("Could not find the pod");
        return res
          .status(500)
          .json({ message: "Could not find the requested pod." });
      }

      await pod.$relatedQuery("members").relate(userId);

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
    res.send({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default invitesRouter;
