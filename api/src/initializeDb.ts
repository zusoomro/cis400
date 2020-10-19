import { Model } from "objection";
import Knex from "knex";
import knexConfig from "../knexfile";

const initializeDb = () => {
  const knex = Knex(knexConfig.development);
  Model.knex(knex);
};

export default initializeDb;
