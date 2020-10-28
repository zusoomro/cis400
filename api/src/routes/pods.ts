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
  console.log("Created pod: ", pod);
});

podsRouter.get("/:ownerId", async (req, res) => {
  console.log("/pods/ownerId");
  const inputOwnerId = req.params.ownerId;
  console.log("inputOwnerId", inputOwnerId);
  const podForUser = await Pod.query().where("ownerId", inputOwnerId);
  res.json(podForUser);
});

export default podsRouter;
