export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiData<T> {
  id: number;
  attributes: T;
}

interface User {
  username: string;
  email: string;
}

interface ContentNode {
  type: string;
  children: {
    type: string;
    text: string;
  }[];
}

export interface Discussion {
  id: number;
  documentId: string;
  title: string;
  content: ContentNode[];
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  users_permissions_user: {  
    data: StrapiData<User> | null;
  };
  replies?: {
    data: StrapiData<Reply>[];
  };
}

export interface Reply {
  content: string;
  createdAt: string;
  updatedAt: string;
  users_permissions_user: {  // Changed from 'author' to match Strapi's field name
    data: StrapiData<User> | null;
  };
  parent_reply?: {
    data: StrapiData<Reply> | null;
  };
}