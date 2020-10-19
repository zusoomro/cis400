import { Model, Modifiers } from "objection";

export default class User extends Model {
  email!: string;
  password!: string;
  podId?: number;
  id!: number;

  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }
}
