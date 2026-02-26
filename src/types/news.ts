export interface News {
  id: number;
  slug: string;
  title_vi: string;
  title_en: string;
  title_zh: string;
  content_vi: string;
  content_en: string;
  content_zh: string;
  excerpt_vi: string;
  excerpt_en: string;
  excerpt_zh: string;
  category: string;
  cover_image: string;
  thumbnail: string;
  status: "draft" | "published";
  author: string;
  author_role: string;
  is_highlight: boolean;
  tags: string;
  meta_desc_vi: string;
  meta_desc_en: string;
  meta_desc_zh: string;
  view_count: number;
  like_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}
