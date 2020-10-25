import express from "express";
import { isConstructorDeclaration } from "typescript";
import Pod from "../../models/Pod";

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
podsRouter.get("/:ownerId", async (req, res) => {
    const inputOwnerId = req.params.ownerId;
    const podForUser = await Pod.query().where("ownerId", inputOwnerId);
    console.log(podForUser);
    res.json(podForUser);
});

export default podsRouter;
