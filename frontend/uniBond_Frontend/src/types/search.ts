export type SearchResultType = "user" | "post" | "group" | "notice" | "task";

export type SearchResult = {
  type: SearchResultType;
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  href: string;
  avatar?: string;
  createdAt?: string;
  isStudyRelated?: boolean;
};

export type SearchResponse = {
  query: string;
  total: number;
  results: SearchResult[];
};
