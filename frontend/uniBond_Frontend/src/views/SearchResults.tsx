import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, FileText, Users, User } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import EmptyState from "@/components/common/EmptyState";
import { handleSearchAll } from "@/controllers/searchController";
import { validateSearch } from "@/utils/validators";
import type { SearchResult } from "@/types/search";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) return;

      const validation = validateSearch(query);
      if (!validation.isValid) {
        setError(validation.error!);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const searchResults = await handleSearchAll(query);
        setResults(searchResults);
      } catch (err) {
        setError("Failed to perform search");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "post":
        return FileText;
      case "user":
        return User;
      case "group":
        return Users;
      case "notice":
        return FileText;
      default:
        return Search;
    }
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (!query) {
    return (
      <SectionCard title="Search Results">
        <EmptyState
          icon={Search}
          title="No search query"
          description="Enter a search term to find posts, users, groups, and notices"
        />
      </SectionCard>
    );
  }

  if (error) {
    return (
      <SectionCard title={`Search Results for "${query}"`}>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={`Search Results for "${query}"`}>
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`No matches found for "${query}"`}
        />
      ) : (
        <div className="space-y-4">
          {results.map((result, index) => {
            const Icon = getIcon(result.type);
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{result.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {getTypeLabel(result.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{result.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}