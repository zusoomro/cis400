import { Model, Modifiers } from "objection";

export default class Event extends Model {
  static get tableName() {
    return "events";
  }

  static get idColumn() {
    return "id";
  }
}
