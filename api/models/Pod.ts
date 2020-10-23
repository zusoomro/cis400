import { Model, Modifiers } from "objection";
import { prependOnceListener } from "process";

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

  // static get relationMappings() {
  //   const User = require("./User");

  //   return {
  //     owner: {
  //       relation: Model.HasOneRelation,
  //       modelClass: User,
  //       join: {
  //         from: "owners.id",
  //         to: "users.id",
  //       },
  //     },
  //     // members: {
  //     //   relation: Model.HasManyRelation,
  //     //   modelClass: User,
  //     //   join: {
  //     //     from: "pods.id",
  //     //     to: "user.id",
  //     //   }
  //     // }
  //   };
    
  // }
}
