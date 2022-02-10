export interface IFollowQuery {
  id: string;
}

export interface IRemoveFollowQuery {
  id: string;
}

export interface IBlockQuery {
  id: string;
}

export interface IUnblockQuery {
  id: string;
}

export interface IRelationshipsResponse {
  success: boolean;
  message?: string;
}

export class RelationshipsResponse {
  constructor(public success: boolean, public message: string) {}
}
