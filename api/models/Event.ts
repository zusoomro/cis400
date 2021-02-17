import { Model, Modifiers } from "objection";

export enum Priority {
  Flexible,
  SemiFlexible,
  Inflexible,
}

export default class Event extends Model {
  id!: number;
  name!: string;
  ownerId!: number;
  formattedAddress!: string;
  lat!: number;
  lng!: number;
  startFormattedAddress!: string;
  startLat!: number;
  startLng!: number;
  start_time!: Date;
  end_time!: Date;
  repeat!: "no_repeat" | "daily" | "weekly" | "monthly" | "yearly";
  notes!: string;
  priority!: Priority;

  static get tableName() {
    return "events";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    const User = require("./User");

    return {
      owner: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: "events.id",
          to: "users.id",
        },
      },
    };
  }
}
