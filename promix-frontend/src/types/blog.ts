export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  author: {
    id: number;
    name: string;
  } | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
}
