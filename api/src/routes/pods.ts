import express from "express";
import { isConstructorDeclaration } from "typescript";
import Pod from "../../models/Pod";
import User from "../../models/User";
import PodInvites from "../../models/PodInvites";
import auth, { AuthRequest } from "../authMiddleware";

const podsRouter = express.Router();

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

    // add a pop to the pods database
    const pod = await Pod.query().insert({
      ownerId: currUser,
      name: name,
    });

    await pod.$relatedQuery("members").relate(user.id);

<<<<<<< variant A
>>>>>>> variant B
    // send invites
======= end
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

podsRouter.get(
  "/currUsersPod",
  [auth],
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as AuthRequest).user.id;
      const podsList = await Pod.query()
        .joinRelated("members")
        .where("members.id", userId)
        .withGraphFetched("members");
      res.json({ pod: podsList });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

export default podsRouter;
