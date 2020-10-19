import { Model, Modifiers } from "objection";

export default class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    const Pod = require("./Pod");

    return {
      pod: {
        relation: Model.HasOneRelation,
        modelClass: Pod,
        join: {
          from: "users.id",
          to: "pods.id",
        },
      },
    };
  }
}
