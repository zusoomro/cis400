import { Model } from "objection";
import Knex from "knex";

const knex = Knex({
  client: "postgres",
  connection: {
    host: "",
    user: "",
    password: "",
    database: "",
  },
});

Model.knex(knex);
