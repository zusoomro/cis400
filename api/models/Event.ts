import { Model, Modifiers } from "objection";

export default class Event extends Model {
  id!: number;
  name!: string;
  ownerId!: number;
  address!: string;
  startTime!: Date;
  endTime!: Date;
  notes!: string;
  
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
