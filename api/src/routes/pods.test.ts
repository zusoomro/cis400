import { getConflictingEvents } from "./pods";
import Event from "../../models/Event";

const basicEvents = [
  {
    id: 2,
    ownerId: 3,
    formattedAddress: "1204 Walnut St, Philadelphia, PA 19107, USA",
    start_time: "2020-11-13T04:20:08.731Z",
    end_time: "2020-11-13T05:20:08.731Z",
    notes: "Nail time.",
    name: "Get nails done",
    lat: 39.94884270000001,
    lng: -75.1608773,
    repeat: "no_repeat",
  },
  {
    id: 3,
    ownerId: 4,
    formattedAddress: "4000 Spruce St, Philadelphia, PA 19104, USA",
    start_time: "2020-11-13T04:21:04.295Z",
    end_time: "2020-11-13T05:21:04.295Z",
    notes: "Sk8r girl time",
    name: "Skateboard",
    lat: 39.951543,
    lng: -75.2032578,
    repeat: "no_repeat",
  },
];

describe("The conflict finder function", () => {
  it("should resolve basic conflicts.", () => {
    const resolvedEvents = getConflictingEvents(
      (basicEvents as unknown) as Event[]
    );

    // This is not the final expected behavior, but works for now
    expect(resolvedEvents.length).toBe(1);
  });
});
