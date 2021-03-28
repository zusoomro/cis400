import User from "./User";

type Pod = {
  id: number;
  name: string;
  ownerId: number;
  members: User[];
  homeAddress: string;
  lat: number;
  lng: number;
};

export default Pod;
