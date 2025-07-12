export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  answer_count: number;
  votes: number;
  user_vote?: 'up' | 'down' | null;
}

export interface Answer {
  id: number;
  question_id: number;
  user_id: number;
  user?: User;
  content: string;
  created_at: string;
  votes: number;
  user_vote?: 'up' | 'down' | null;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface PaginationInfo {
  page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
  message?: string;
}

export interface FilterOptions {
  search?: string;
  tag?: string;
  sort?: 'newest' | 'oldest' | 'unanswered';
}