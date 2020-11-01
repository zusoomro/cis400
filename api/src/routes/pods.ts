import express from "express";
import { isConstructorDeclaration } from "typescript";
import Pod from "../../models/Pod";
import PodInvites from "../../models/PodInvites";
import auth, { AuthRequest } from "../authMiddleware";

let podsRouter = express.Router();

podsRouter.get("/", async (req, res) => {
  const response = await Pod.query();
  console.log(response);
  res.json(response);
});

// used to create a new pod
podsRouter.post(
  "/",
  [auth],
  async (req: express.Request, res: express.Response) => {
    console.log(req.body);
    const { user } = req as AuthRequest;
    const currUser = (req as AuthRequest).user.id;
    const name: string = req.body.name;

    const inviteeIds: Array<number> = req.body.inviteeIds;

    const pod = await Pod.query().insert({
      ownerId: currUser,
      name: name,
    });

    inviteeIds.forEach(async (id) => {
      const invite = await PodInvites.query().insert({
        inviteeUserId: id,
        inviterUserId: currUser,
        podId: pod.id,
      });
    });

    console.log("Created pod: ", pod);
    res.send(pod);
  }
);

// currently the only member of the pod is the owner which is why we query for 'where("ownerId", userId)'
// this will change once we add members to a pod.
podsRouter.get(
  "/currUsersPod",
  [auth],
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as AuthRequest).user.id;
      const podsList = await Pod.query().where("ownerId", userId);
      const firstPodForUser = podsList[0];
      console.log("pod", firstPodForUser);
      res.json({ pod: firstPodForUser });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

export default podsRouter;
