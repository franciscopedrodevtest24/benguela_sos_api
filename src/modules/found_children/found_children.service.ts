import { _create_found_children, _update_found_children, _update_status_found_children, query_filter_found_children } from "./found_children.models";
import { found_children_repository, FoundChildrenRepository } from "./found_children.repository";








export class FoundChildrenService{
    constructor(private repository:FoundChildrenRepository){
        this.repository=repository
    }
    async create(data:typeof _create_found_children.static){

        return await this.repository.create(data)

    }

    async get_all_found_children(query: typeof query_filter_found_children.static){
        return await this.repository.get_all_found_children(query)
    }


      async update_children(
    id: string,
    data: typeof _update_found_children.static,
  ) {
    const children = await this.repository.update_children(id,data)
    return children;
  }
  async update_status_children(
    id: string,
    data: typeof _update_status_found_children.static,
  ) {
    const children = await this.repository.update_status_children(id,data)
    return children;
  }
  async get_by_id(id:string){
    return await this.repository.get_by_id(id)
  }
  async remove(id:string){
    return await this.repository.remove(id)
  }
}

export const found_children_service=new FoundChildrenService(found_children_repository)