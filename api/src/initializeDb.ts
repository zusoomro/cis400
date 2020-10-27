import { Model } from "objection";
import Knex from "knex";
import knexConfig from "../knexfile";

const initializeDb = () => {
  const environment = process.env.ENVIRONMENT
    ? knexConfig.production
    : knexConfig.development;

  const knex = Knex(environment);
  Model.knex(knex);
};

export default initializeDb;
