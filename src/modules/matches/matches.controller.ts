import Elysia, { t } from "elysia";
import { child_matches_models } from "./matches.models";
import { matches_service } from "./matches.service";
import { auth_true_user } from "../../plugins/better_auth";

export const matches_controller = new Elysia()
  .use(child_matches_models)
  .use(auth_true_user)
  .post(
    "/run",
    async ({ body, status }) => {
      const data = await matches_service.runMatching(body.min_score);
      return status("OK", {
        data,
        success: true,
        timestamp: new Date().toISOString(),
        message: "Processo de matching executado",
      });
    },
    {
      auth:true,
      body: "run_matching_payload",
      detail:{

       summary: "Executar matching automático",
       description: "Este endpoint permite executar o processo de matching automático entre crianças encontradas e desaparecidas. O matching é realizado com base em uma pontuação mínima definida pelo usuário. O resultado é retornado como uma lista de matches encontrados.",
       tags: ["Matches"],
      }
    },
  )
  .get(
    "/",
    async ({ query, status }) => {
      const { items, pagination } = await matches_service.list(query);
      return status("OK", {
        data: { items, pagination },
        success: true,
        timestamp: new Date().toISOString(),
      });
    },
    {auth:true,
      query: "query_filter_child_matches",
      response: {
        200: "child_matches_paginated",
        500: "child_matches_error_api",
      },
      detail:{
        summary: "Listar matches",
        description: "Este endpoint permite consultar todas as matches registadas no sistema. Retorna uma lista com os dados fornecidos no momento do registo, incluindo informações como idade estimada, descrição física, localização e estado atual do caso.",
        tags: ["Matches"],
      }
    },
  )
  .patch(
    "/:id/status",
    async ({ params, body, status }) => {
      const data = await matches_service.update_status(params.id, body);
      if (!data) {
        return status("Not Found", {
          success: false,
          timestamp: new Date().toISOString(),
          error: { message: "Match não encontrado" },
        });
      }
      return status("OK", {
        data,
        success: true,
        timestamp: new Date().toISOString(),
      });
    },
    {auth:true,
      params: t.Object({ id: t.String() }),
      body: "_update_child_match_status",
      response: {
        200: "child_matches_success",
        404: "child_matches_error_api",
      },
      detail:{
        summary: "Atualizar status do match",
        description: "Este endpoint permite atualizar o status de um match com base no seu ID. O status pode ser 'pending_verification', 'verified', 'resolved' ou 'archived'.",
        tags: ["Matches"],
      }
    },
  );
