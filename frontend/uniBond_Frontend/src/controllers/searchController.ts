import { searchAll } from "@/models/searchModel";
import type { SearchResponse, SearchResultType } from "@/types/search";

export const handleSearchAll = async (
  query: string,
  options?: { limit?: number; types?: SearchResultType[] }
): Promise<SearchResponse> => {
  return await searchAll(query, options);
};
