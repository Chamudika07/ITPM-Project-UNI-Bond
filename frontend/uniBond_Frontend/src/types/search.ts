export type SearchResult = {
  type: "post" | "user" | "group" | "notice";
  id: string;
  title: string;
  description: string;
  avatar?: string;
};