import { Model, Modifiers } from "objection";
import path from "path";

export default class Pod extends Model {
  id!: number;
  name!: string;
  ownerId?: number;
  members!: any[];

  static get tableName() {
    return "pods";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    return {
      owner: {
        relation: Model.HasOneRelation,
        modelClass: path.join(__dirname, "User"),
        join: {
          from: "owners.id",
          to: "users.id",
        },
      },
      members: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname, "User"),
        join: {
          from: "pods.id",
          through: {
            from: "usersPods.podId",
            to: "usersPods.userId",
          },
          to: "users.id",
        },
      },
    };
  }
}
