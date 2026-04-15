import Elysia from "elysia";
import { found_children_routes } from "../modules/found_children/found_children.route";
import { missing_children_routes } from "../modules/missing_children/missing_children.route";
import { matches_routes } from "../modules/matches/matches.route";
import { auth } from "../lib/auth";

export const routes_global = new Elysia({
  prefix: "/api",
  name: "API de Crianças Encontradas",
  tags: ["API Geral"],
  detail: {
    summary: "Ponto de entrada da API",
    description:
      "Esta é a configuração global da API responsável por centralizar todas as rotas do sistema. Através deste ponto, é possível aceder aos módulos como o registo e gestão de crianças encontradas, permitindo operações como criação, consulta e acompanhamento de casos.",
  },
})
  .use(found_children_routes)
  .use(missing_children_routes)
  .use(matches_routes)
  .mount(auth.handler)
