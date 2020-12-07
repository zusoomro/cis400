import { Alert} from "react-native";
import Event from "../types/Event";

export enum ConflictAction {
  editEvent,   // Return to event page to edit event
  suggestedTime,  // Schedule the event with the suggested time
  scheduleEvent, // Schedule the conflicting evet
}

export const eventConflictAlert = () => new Promise<ConflictAction>((resolve) => {
  Alert.alert(
    "Event Conflicts",
    "This event will conflict with </Insert event it conflicts with & new suggested time/>",
    [
      {
        text: "Schedule Event at <Insert suggested time/>",
        onPress: () => {
            resolve(ConflictAction.suggestedTime);
        },
        style: "cancel"
      },
      {
        text: "Edit Time",
        onPress: () => {
          resolve(ConflictAction.editEvent);
        },
        style: "default"
      },
      { 
        text: "Schedule Event Anyway", 
        onPress: () => {
            resolve(ConflictAction.scheduleEvent);
        },
        style: "destructive"
    }
    ],
  );
});

export const isConflictingEvent = (): boolean => {
    return true;
}
