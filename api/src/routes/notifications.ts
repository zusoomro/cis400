import { Expo } from "expo-server-sdk";
import express, { Request, Response } from "express";
import auth, { AuthRequest } from "../authMiddleware";
import User from "../../models/User";
const expo = new Expo();

let notificationsRouter = express.Router();

notificationsRouter.post(
  "/token",
  [auth],
  async (req: Request, res: Response) => {
    const { token, userId } = req.body;

    const user = await User.query().patchAndFetchById(userId, {
      notificationToken: token,
    });

    return res.json({ user });
  }
);

notificationsRouter.post(
  "/message",
  [auth],
  async (req: Request, res: Response) => {
    const { recipientId, eventId } = req.body;

    const recipient = await User.query().findById(recipientId);

    if (!Expo.isExpoPushToken(recipient.notificationToken)) {
      res
        .status(400)
        .send({ message: "We were unable to send the notification." });
    }

    const message = {
      to: recipient.notificationToken,
      sound: undefined,
      title: "You have a new conflicting event!",
      body:
        "View your schedule and remove the conflict to resolve the schedule.",
      data: { eventId },
    };
    try {
      const receipt = await expo.sendPushNotificationsAsync([message]);

      return res.json(receipt);
    } catch (err) {
      return res.status(500).json({
        message: "There was a server error in sending the notification.",
      });
    }
  }
);

export default notificationsRouter;
