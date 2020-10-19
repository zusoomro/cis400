import { Model, Modifiers } from "objection";

export default class Pod extends Model {
  static get tableName() {
    return "pods";
  }

  static get idColumn() {
    return "id";
  }
}
