import express from "express";
import { isConstructorDeclaration } from "typescript";
import Pod from "../../models/Pod";
import auth, { AuthRequest } from "../authMiddleware";

let podsRouter = express.Router();

podsRouter.get("/", async (req, res) => {
    const response = await Pod.query();
    console.log(response);
    res.json(response);
});

podsRouter.post("/", 
    [auth], 
    async (req: express.Request, res: express.Response) => {
        console.log(req.body);
        const { user } = (req as AuthRequest);
        const currUser = (req as AuthRequest).user.id;
        const name : string = req.body.name;
        
        const pod = await Pod.query().insert({
            ownerId: currUser,
            name: name,
        });
        console.log('Created pod: ', pod);
        res.send(pod);
});

podsRouter.get(
    "/currUsersPod", 
    [auth], async (req: express.Request, res: express.Response) => {
        console.log('in route /pods/currUsersPod');
        try {
            const userId = (req as AuthRequest).user.id;
            console.log('curr user id', userId);
            const podsList = await Pod.query().where("ownerId", userId);
            const firstPodForUser = podsList[0];
            console.log('return pod', firstPodForUser);
            res.json({ pod: firstPodForUser });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
          }
    }
);

// podsRouter.get("/delete", async (req, res) => {
//     console.log('delete');
//     const numDeleted = await Pod.query().deleteById(15);
// });

export default podsRouter;
