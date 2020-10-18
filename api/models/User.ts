import { Model, Modifiers } from "objection";

export default class User extends Model {
  static get tableName() {
    return "Users";
  }

  static get idColumn() {
    return "id";
  }
}
