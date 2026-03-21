import { mockSearchAll } from "@/services/mock/mockSearchApi";
import type { SearchResult } from "@/types/search";

export const searchAll = async (query: string): Promise<SearchResult[]> => {
  return await mockSearchAll(query);
};