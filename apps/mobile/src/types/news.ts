export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type NewsScreenState = {
  status: 'loading' | 'success' | 'error';
  data: Post[];
  errorMessage: string | null;
};
