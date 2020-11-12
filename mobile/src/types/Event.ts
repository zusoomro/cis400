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
};

export default Event;
