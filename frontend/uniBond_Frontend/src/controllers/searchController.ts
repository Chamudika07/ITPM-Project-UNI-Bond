import { searchAll } from "@/models/searchModel";
import type { SearchResult } from "@/types/search";

export const handleSearchAll = async (query: string): Promise<SearchResult[]> => {
  return await searchAll(query);
};