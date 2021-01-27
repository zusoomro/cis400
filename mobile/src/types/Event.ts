type Event = {
  id: number;
  name: string;
  ownerId: number;
  formattedAddress: string;
  lat: number;
  lng: number;
  start_time: Date;
  end_time: Date;
  repeat: "no_repeat" | "daily" | "weekly" | "monthly" | "yearly";
  notes: string;
  priority: Priority;
};

export enum Priority {
  Flexible,
  "Semi-Flexible",
  Inflexible,
}

export default Event;
