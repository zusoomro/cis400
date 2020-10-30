import { Model, Modifiers } from "objection";

export default class PodInvites extends Model {
  id!: number;
  inviterUserId!: number;
  inviteeUserId!: number;
  podId!: number;

  static get tableName() {
    return "podInvites";
  }

  static get idColumn() {
    return "id";
  }
}
