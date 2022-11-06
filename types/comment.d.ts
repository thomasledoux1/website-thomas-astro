import type { Blog } from './blog';

export type Comment = {
  id: number;
  created_at: string;
  text: string;
  author: string;
  blodid: number;
  blogs?: Blog[];
};
