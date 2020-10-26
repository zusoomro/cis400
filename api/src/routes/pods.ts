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

podsRouter.post("/", async (req, res) => {
    console.log(req.body);
    const { ownerId, name } = req.body;
    
    const pod = await Pod.query().insert({
        ownerId: ownerId,
        name: name,
    });
    console.log('Created pod: ', pod);
});

// currently the only members of a pod are an owner which is why we search
// for based on owner id here -- this will obviously change once we add members
// podsRouter.get("/:ownerId", async (req, res) => {
//     console.log('in route /pods/:ownerid');
//     const inputOwnerId = req.params.ownerId;
//     const podForUser = await Pod.query().where("ownerId", inputOwnerId);
//     console.log(podForUser);
//     res.json(podForUser);
// });

podsRouter.get(
    "/currUsersPod", 
    [auth], async (req: express.Request, res: express.Response) => {
        console.log('in route /pods/currUsersPod');
        try {
            const userId = (req as AuthRequest).user.id;
            console.log('curr user id', userId);
            const podForUser = await Pod.query().where("ownerId", userId);
            console.log("pod for current user:", podForUser);
            res.json({podForUser});
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
