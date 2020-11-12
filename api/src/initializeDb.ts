import { Model } from "objection";
import Knex from "knex";
import knexConfig from "../knexfile";

const initializeDb = () => {
  let environment;
  if (process.env.ENVIRONMENT) {
    environment = knexConfig.production;
  } else if (process.env.NODE_ENV == "test") {
    environment = knexConfig.testing;
  } else {
    environment = knexConfig.development;
  }

  const knex = Knex(environment);

  Model.knex(knex);

  return knex;
};

export default initializeDb;
