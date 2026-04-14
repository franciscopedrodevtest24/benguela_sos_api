import {
  _create_missing_children,
  _update_missing_children,
  _update_status_missing_children,
  query_filter_missing_children,
} from "./missing_children.models";
import {
  MissingChildrenRepository,
  missing_children_repository,
} from "./missing_children.repository";

export class MissingChildrenService {
  constructor(private repository: MissingChildrenRepository) {
    this.repository = repository;
  }

  async create(data: typeof _create_missing_children.static) {
    return await this.repository.create(data);
  }

  async get_all_missing_children(query: typeof query_filter_missing_children.static) {
    return await this.repository.get_all_missing_children(query);
  }

  async get_by_id(id: string) {
    return await this.repository.get_by_id(id);
  }

  async update_children(id: string, data: typeof _update_missing_children.static) {
    return await this.repository.update_children(id, data);
  }

  async update_status_children(
    id: string,
    data: typeof _update_status_missing_children.static,
  ) {
    return await this.repository.update_status_children(id, data);
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }
}

export const missing_children_service = new MissingChildrenService(missing_children_repository);
