import Elysia from "elysia";
import { found_children_controller } from "./found_children.controller";


export const found_children_routes=new  Elysia({
    prefix:"/found_children",
    detail: {
    summary: "Registo de crianças encontradas",
    description:
      "Este endpoint permite registar, consultar e gerir informações sobre crianças encontradas. Inclui dados como idade estimada, género, descrição física, local e data em que foram encontradas, bem como informações do denunciante. O objetivo é facilitar a identificação e reunificação com familiares.",
    tags: ["Crianças Encontradas"]
  }
})
.use(found_children_controller)