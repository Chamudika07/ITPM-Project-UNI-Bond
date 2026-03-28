import apiClient from "@/services/api/axiosClient";
import type { SearchResponse, SearchResult, SearchResultType } from "@/types/search";

const mapSearchResult = (result: any): SearchResult => ({
  id: String(result.id),
  type: result.type as SearchResultType,
  title: result.title || "Untitled result",
  description: result.description || "",
  subtitle: result.subtitle || undefined,
  href: result.href || "/search",
  avatar: result.avatar || undefined,
  createdAt: result.created_at || undefined,
  isStudyRelated: Boolean(result.is_study_related),
});

export const searchAll = async (
  query: string,
  options?: { limit?: number; types?: SearchResultType[] }
): Promise<SearchResponse> => {
  const response = await apiClient.get("/search", {
    params: {
      q: query.trim(),
      limit: options?.limit ?? 8,
      types: options?.types,
    },
  });

  return {
    query: response.data?.query || query.trim(),
    total: Number(response.data?.total || 0),
    results: Array.isArray(response.data?.results) ? response.data.results.map(mapSearchResult) : [],
  };
};
