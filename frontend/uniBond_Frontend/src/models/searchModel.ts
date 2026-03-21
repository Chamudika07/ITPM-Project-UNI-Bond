import { mockSearchAll } from "@/utils/mockSearchApi";
import type { SearchResult } from "@/types/search";

export const searchAll = async (query: string): Promise<SearchResult[]> => {
  return await mockSearchAll(query);
};