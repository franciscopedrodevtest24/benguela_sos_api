import Elysia from "elysia";
import { matches_controller } from "./matches.controller";

export const matches_routes = new Elysia({
  prefix: "/matches",
  detail: {
    summary: "Match automático entre casos",
    description:
      "Endpoints para executar reconciliação entre crianças encontradas e desaparecidas e gerir os matches.",
    tags: ["Matches"],
  },
}).use(matches_controller);
