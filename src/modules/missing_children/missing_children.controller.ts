import Elysia, { t } from "elysia";
import { missing_children_models } from "./missing_children.models";
import { missing_children_service } from "./missing_children.service";
import { auth_true_user } from "../../plugins/better_auth";

export const missing_children_controller = new Elysia()
  .use(missing_children_models)
  .use(auth_true_user)
  .post(
    "/",
    async ({ body, status }) => {
      const data = await missing_children_service.create(body);
      return status("Created", {
        data,
        success: true,
        timestamp: new Date().toISOString(),
        message: "Criança desaparecida registrada",
      });
    },
    {
      body: "create_missing_children",
      response: {
        201: "missing_children_success",
        500: "missing_children_error_api",
      },

      detail:{
        summary: "Registar criança desaparecida",
        description: "Este endpoint permite registar uma criança desaparecida no sistema. Devem ser fornecidas informações como idade estimada, género, descrição física, local e data em que foi desaparecida, bem como os dados do denunciante. O registo ficará com estado inicial 'pending_verification' para posterior validação.",
        tags: ["Crianças Desaparecidas"],
      }
    },
  )
  .get(
    "/",
    async ({ query, status }) => {
      const { items, pagination } = await missing_children_service.get_all_missing_children(query);
      return status("OK", {
        data: { items, pagination },
        success: true,
        timestamp: new Date().toISOString(),
        message: "Lista de crianças desaparecidas recuperada com sucesso",
      });
    },
    {auth:true,
      query: "query_filter_missing_children",
      response: {
        200: "missing_children_paginated",
        500: "missing_children_error_api",
      },
      detail:{
        summary: "Listar crianças desaparecidas",
        description: "Este endpoint permite consultar todas as crianças desaparecidas registadas no sistema. Retorna uma lista com os dados fornecidos no momento do registo, incluindo informações como idade estimada, descrição física, localização e estado atual do caso.",
        tags: ["Crianças Desaparecidas"],
      }
    },
  )
  .get(
    "/:id",
    async ({ params, status }) => {
      const data = await missing_children_service.get_by_id(params.id);
      if (!data) {
        return status("Not Found", {
          success: false,
          timestamp: new Date().toISOString(),
          error: { message: "Registro não encontrado" },
        });
      }
      return status("OK", {
        data,
        success: true,
        timestamp: new Date().toISOString(),
      });
    },
    {
      params: t.Object({ id: t.String() }),
      response: {
        200: "missing_children_success",
        404: "missing_children_error_api",
      },
      detail:{
        summary: "Consultar criança desaparecida",
        description: "Este endpoint permite consultar uma criança desaparecida com base no seu ID. Retorna os dados completos do registro, incluindo informações como idade estimada, descrição física, localização e estado atual do caso.",
        tags: ["Crianças Desaparecidas"],
      }
    },
  )
  .put(
    "/:id",
    async ({ params, body, status }) => {
      const data = await missing_children_service.update_children(params.id, body);
      if (!data) {
        return status("Not Found", {
          success: false,
          timestamp: new Date().toISOString(),
          error: { message: "Registro não encontrado" },
        });
      }
      return status("OK", {
        data,
        success: true,
        timestamp: new Date().toISOString(),
        message: "Registro atualizado",
      });
    },
    {auth:true,
      body: "update_missing_children",
      params: t.Object({ id: t.String() }),
      response: {
        200: "missing_children_success",
        404: "missing_children_error_api",
        500: "missing_children_error_api",
      },
      detail:{
        summary: "Atualizar dados da criança desaparecida",
        description: "Este endpoint permite atualizar todas as informações de uma criança desaparecida com base no seu ID. Os dados incluem descrição física, localização, estado atual, dados do denunciante e outras informações relevantes. É uma atualização completa do registo.",
        tags: ["Crianças Desaparecidas"],
      }
    },
  )
  .patch(
    "/:id/status",
    async ({ params, body, status }) => {
      const data = await missing_children_service.update_status_children(params.id, body);
      if (!data) {
        return status("Not Found", {
          success: false,
          timestamp: new Date().toISOString(),
          error: { message: "Registro não encontrado" },
        });
      }
      return status("OK", {
        data,
        success: true,
        timestamp: new Date().toISOString(),
        message: "Estado atualizado",
      });
    },
    {auth:true,
      body: "_update_status_missing_children",
      params: t.Object({ id: t.String() }),
      response: {
        200: "missing_children_success",
        404: "missing_children_error_api",
        500: "missing_children_error_api",
      },
      detail:{
        summary: "Atualizar estado da criança desaparecida",
        description: "Este endpoint permite atualizar apenas o estado de um registo de criança desaparecida (por exemplo: pending_verification, verified, resolved ou archived). É útil para controlar o progresso da identificação e resolução do caso sem alterar outros dados.",
        tags: ["Crianças Desaparecidas"],
      }
    },
  )
  .delete(
    "/:id",
    async ({ params, status }) => {
      const data = await missing_children_service.remove(params.id);
      if (!data) {
        return status("Not Found", {
          success: false,
          timestamp: new Date().toISOString(),
          error: { message: "Registro não encontrado" },
        });
      }
      return status("OK", {
        data,
        success: true,
        timestamp: new Date().toISOString(),
        message: "Registro removido",
      });
    },
    {auth:true,
      params: t.Object({ id: t.String() }),
      response: {
        200: "missing_children_success",
        404: "missing_children_error_api",
      },
      detail:{
        summary: "Remover criança desaparecida",
        description: "Este endpoint permite remover um registro de criança desaparecida com base no seu ID. Esta ação é irreversível e deve ser utilizada com cuidado. Apenas os administradores têm permissão para executar esta operação.",
        tags: ["Crianças Desaparecidas"],
      }
    },
  );
