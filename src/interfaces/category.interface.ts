export interface ICreateCategory {
  name: string;
  parentId?: string;
}

export interface IUpdateCategory {
  name?: string;
  parentId?: string;
}

export interface ICategoryResponse {
  id: string;
  name: string;
  isActive: boolean;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  parents?: any[];
}
