import Elysia, { t } from "elysia";
import { found_children_models } from "./found_children.models";
import { found_children_service } from "./found_children.service";
import { auth_true_user } from "../../plugins/better_auth";

export const found_children_controller = new Elysia()
  .use(found_children_models)
  .use(auth_true_user)
  .post(
    "/",
    async ({ body, status }) => {
      const data = await found_children_service.create(body);
      return status("Created", {
        data: data,
        success: true,
        timestamp: new Date().toISOString(),
        message: "Criança registrada",
      });
    },
    {
      body: "create_found_children",
      detail: {
        summary: "Registar criança encontrada",
        description:
          "Este endpoint permite registar uma criança encontrada no sistema. Devem ser fornecidas informações como idade estimada, género, descrição física, local e data em que foi encontrada, bem como os dados do denunciante. O registo ficará com estado inicial 'pending_verification' para posterior validação.",
        tags: ["Crianças Encontradas"],
      },
      response: {
        201: "found_children_success",
        500: "found_children_error_api",
      },
    },
  )
  .get(
    "/",
    async ({ status, query }) => {
      const { items, pagination } =
        (await found_children_service.get_all_found_children(query)) ?? [];

      return status("OK", {
        data: {
          items: items,
          pagination: pagination,
        },
        success: true,
        message: "Lista de crianças encontradas recuperada com sucesso",
        timestamp: new Date().toISOString(),
      });
    },
    {
      auth:true,
      query: "query_filter_found_children",
      response: {
        200: "found_children_paginated",
        500: "found_children_error_api",
      },
      detail: {
        summary: "Listar crianças encontradas",
        description:
          "Este endpoint permite consultar todas as crianças encontradas registadas no sistema. Retorna uma lista com os dados fornecidos no momento do registo, incluindo informações como idade estimada, descrição física, localização e estado atual do caso.",
        tags: ["Crianças Encontradas"],
      },
    },
  )
  .get(
    "/:id",
    async ({ params, status }) => {
      const data = await found_children_service.get_by_id(params.id);
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
    {auth:true,
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: "found_children_success",
        404: "found_children_error_api",
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body, status }) => {
      const data = await found_children_service.update_children(
        params.id,
        body,
      );

      try {
        return status("OK", {
          data: data,
          success: true,
          timestamp: new Date().toISOString(),
          message: "Criança atualizada",
        });
      } catch (error) {
        return status("Internal Server Error", {
          success: false,
          timestamp: new Date().toISOString(),
          error: { error },
        });
      }
    },
    {auth:true,
      body: "update_found_children",
      response: {
        200: "found_children_success",
        500: "found_children_error_api",
      },
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Atualizar dados da criança encontrada",
        description:
          "Este endpoint permite atualizar todas as informações de uma criança encontrada com base no seu ID. Os dados incluem descrição física, localização, estado atual, dados do denunciante e outras informações relevantes. É uma atualização completa do registo.",
        tags: ["Crianças Encontradas"],
      },
    },
  )
  .patch(
    "/:id/status",
    async ({ params, body, status }) => {
      const { id } = params;

      const data = await found_children_service.update_status_children(
        id,
        body,
      );

      try {
        return status("OK", {
          data: data,
          success: true,
          timestamp: new Date().toISOString(),
          message: "Criança atualizada",
        });
      } catch (error) {
        return status("Internal Server Error", {
          success: false,
          timestamp: new Date().toISOString(),
          error: { error },
        });
      }
    },
    {auth:true,
      body: "_update_status_found_children",
      response: {
        200: "found_children_success",
        500: "found_children_error_api",
        400: "found_children_error_api",
      },
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Atualizar estado da criança encontrada",
        description:
          "Este endpoint permite atualizar apenas o estado de um registo de criança encontrada (por exemplo: pending_verification, verified, resolved ou archived). É útil para controlar o progresso da identificação e resolução do caso sem alterar outros dados.",
        tags: ["Crianças Encontradas"],
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, status }) => {
      const data = await found_children_service.remove(params.id);
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
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: "found_children_success",
        404: "found_children_error_api",
      },
    },
  );
