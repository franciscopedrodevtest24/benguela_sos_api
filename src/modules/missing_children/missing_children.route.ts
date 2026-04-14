import Elysia from "elysia";
import { missing_children_controller } from "./missing_children.controller";

export const missing_children_routes = new Elysia({
  prefix: "/missing_children",
  detail: {
    summary: "Registo de crianças desaparecidas",
    description:
      "Endpoints para registar, consultar, atualizar e remover crianças desaparecidas.",
    tags: ["Crianças Desaparecidas"],
  },
}).use(missing_children_controller);
