import { Model, Modifiers } from "objection";
import path from "path";

export default class User extends Model {
  email!: string;
  password!: string;
  id!: number;
  avatar!: string;

  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    return {
      pods: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname, "Pod"),
        join: {
          from: "users.id",
          through: {
            from: "usersPods.userId",
            to: "usersPods.podId",
          },
          to: "pods.id",
        },
      },
    };
  }
}
