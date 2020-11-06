import { Model, Modifiers } from "objection";
import { prependOnceListener } from "process";
import path from "path";

export default class Pod extends Model {
  id!: number;
  name!: string;
  ownerId?: number;

  static get tableName() {
    return "pods";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const User = require("./User");

    return {
      owner: {
        relation: Model.HasOneRelation,
        modelClass: User,
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
