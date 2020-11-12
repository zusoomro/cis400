type Event = {
  id: number;
  name: string;
  ownerId: number;
  address: string;
  start_time: Date;
  end_time: Date;
  notes: string;
};

export default Event;
