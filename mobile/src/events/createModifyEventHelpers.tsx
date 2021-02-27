import Event, { Priority } from "../types/Event";
import * as Yup from "yup";

/** Imports to update the redux state */
import { useDispatch } from "react-redux";
import { changeEvent as reduxChangeEvent } from "./eventsSlice";

/** Import functions to connect to backend */
import { createEventOnSubmit, modifyEventOnSubmit } from "./eventsService";
import {
  proposeEvent,
  ProposedEventConflicts,
  SuggestedTime,
  getSuggestedTimes,
} from "./eventConflictService";

import { fetchUserPod } from "./scheduleService";
import Pod from "../types/Pod";

/**
 * File that contains types, constants, and helper
 * functions for Creating and Modifying an
 * Event.
 * */
/************ TYPES ******************/
export type CreateModifyEventProps = {
  event?: Event;
  pod: Pod;
  navigation: {
    navigate: (screen: string) => void;
  };
  route: Object;
};

export type eventFormikValues = {
  name: string;
  formattedAddress: string;
  lat: number | string;
  lng: number | string;
  startFormattedAddress: string;
  startLat: number | string;
  startLng: number | string;
  start_time: Date;
  end_time: Date;
  repeat: string;
  notes: string;
  priority: Priority;
};

/********** CONSTANTS ******************/
export const repetitionValues = [
  { label: "Does not repeat", value: "no_repeat" },
  { label: "Every day", value: "daily" },
  { label: "Every week", value: "weekly" },
  { label: "Every month", value: "monthly" },
  { label: "Every year", value: "yearly" },
];

export const priorityValues = [
  { label: "Flexible", value: 0 },
  { label: "SemiFlexible", value: 1 },
  { label: "Inflexible", value: 2 },
];

/*********** HELPER FUNCTIONS **********/

// Create initial values for an empty create event form
export const emptyFormEventValues = (
  start_time: Date,
  end_time: Date,
  homeAddress: string,
  homeLat: number,
  homeLng: number
): eventFormikValues => {
  return {
    name: "",
    formattedAddress: "",
    lat: "",
    lng: "",
    startFormattedAddress: homeAddress,
    startLat: homeLat,
    startLng: homeLng,
    start_time: start_time,
    end_time: end_time,
    repeat: repetitionValues[0].value,
    notes: "",
    priority: 0,
  };
};

// Create formik values for modify event page
export const populatedFormEventValues = (event: Event): eventFormikValues => {
  return {
    name: event.name,
    formattedAddress: event.formattedAddress,
    lat: event.lat,
    lng: event.lng,
    startFormattedAddress: event.startFormattedAddress,
    startLat: event.startLat,
    startLng: event.startLng,
    start_time: event.start_time,
    end_time: event.end_time,
    repeat: repetitionValues[0].value,
    notes: event.notes,
    priority: event.priority,
  };
};

export const validateEventSchema = () => {
  return Yup.object().shape({
    name: Yup.string().required("Name required"),
    formattedAddress: Yup.string().required("Destination location Required"),
    startFormattedAddress: Yup.string().required("Start location Required"),
    // Make sure end_time > start_time
    start_time: Yup.date().required(),
    end_time: Yup.date().min(
      Yup.ref("start_time"),
      "End time needs to be after start time"
    ),
  });
};

// Type aliases of functions that set the components state or props
type NavigationProp = {
  navigate: (screen: string) => void;
};

type SetValuesOnSubmitFunction = React.Dispatch<
  React.SetStateAction<Event | undefined>
>;
type SetConflictValuesFunction = React.Dispatch<
  React.SetStateAction<ProposedEventConflicts | undefined>
>;
type SetSuggestedTimesFunction = React.Dispatch<
  React.SetStateAction<SuggestedTime[] | undefined>
>;
type SetConflictModalVisibleFunction = React.Dispatch<
  React.SetStateAction<boolean>
>;

/**
 * scheduleEvent creates or modifies an event.
 * If an eventExists then the event is modified,
 * otherwise the event is created.
 *
 * @param values: values to use for the scheduled event.
 * @param existingEvent: event if it previously existed
 * @param navigation: prop to navigate to another component
 */
export const scheduleEvent = (
  values: eventFormikValues,
  existingEvent: Event | null,
  navigation: NavigationProp,
  helperDispatch
) => {
  if (existingEvent) {
    modifyEventOnSubmit({
      ...values,
      id: existingEvent.id,
    } as Event).then((res) => {
      helperDispatch(reduxChangeEvent(res.eventForReturn[0]));
    });
  } else {
    createEventOnSubmit(values as Event).then((res) => {
      helperDispatch(reduxChangeEvent(res));
    });
  }
  navigation.navigate("ScheduleHomePage");
};

/***
 * Function to run when user submits formik form on
 * CreateModifyEvent component.
 *
 * This function first checks if there are event conflicts. If there are no event conflicts
 * then the event is modified or created.
 *
 * @param values: values of form on submit
 * @param existingEvent: event if it previously existed (i.e if youre modifying an event)
 * @param navigation: prop to navigate to another component
 * @param setValuesOnSubmit: sets valuesOnSubmit state which is sent to the EventConflictModal
 * if there are conflits.
 * @param setConflictValues: sets conflictValues state which is sent to the EventConflictModal
 * if there are conflits.
 * @param setSuggestedTimes: sets suggestedTimes state which is sent to the EventConflictModal
 * if there are conflits.
 * @param setConflictModalVisible: sets conflictModalVisible to true or false.
 * @param helperDispatch: wraps dispatch to call within helper function
 */
export const submitCreateModifyEventForm = async (
  values: eventFormikValues,
  existingEvent: Event | null,
  navigation: NavigationProp,
  setValuesOnSubmit: SetValuesOnSubmitFunction,
  setConflictValues: SetConflictValuesFunction,
  setSuggestedTimes: SetSuggestedTimesFunction,
  setConflictModalVisible: SetConflictModalVisibleFunction,
  helperDispatch
) => {
  const pod = await fetchUserPod();

  const conflicts: ProposedEventConflicts | false =
    pod != undefined &&
    (await proposeEvent(values as Event, pod.id, existingEvent))!;

  // If event is in a pod && If event has conflicts, show the conflict modal
  if (conflicts && conflicts.isConflicting) {
    const suggestedTimes: SuggestedTime[] | false =
      pod != undefined &&
      (await getSuggestedTimes(values as Event, pod.id, existingEvent))!;
    setValuesOnSubmit(values as Event);
    setConflictValues(conflicts);
    if (suggestedTimes) {
      setSuggestedTimes(suggestedTimes);
    }
    setConflictModalVisible(true);
    return;
  }
  scheduleEvent(values, existingEvent, navigation, helperDispatch);
};
