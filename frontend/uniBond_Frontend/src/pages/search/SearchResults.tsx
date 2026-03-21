import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, FileText, Users, User, CheckCircle } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import EmptyState from "@/components/common/EmptyState";
import { handleSearchAll } from "@/controllers/searchController";
import { validateSearch } from "@/utils/validators";
import type { SearchResult } from "@/types/search";

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Study Resources", value: "study" },
  { label: "Posts", value: "post" },
  { label: "Users", value: "user" },
  { label: "Groups", value: "group" },
  { label: "Notices", value: "notice" }
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

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
      case "post": return FileText;
      case "user": return User;
      case "group": return Users;
      case "notice": return FileText;
      default: return Search;
    }
  };

  const filteredResults = results.filter(r => {
    if (activeFilter === "all") return true;
    if (activeFilter === "study") return r.isStudyRelated === true;
    return r.type === activeFilter;
  });

  if (!query) {
    return (
      <SectionCard title="Search Results">
        <EmptyState icon={Search} title="No search query" description="Enter a search term to find posts, users, groups, and notices" />
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
    <div className="space-y-6">
      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeFilter === opt.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <SectionCard title={`Results for "${query}"`}>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <EmptyState icon={Search} title="No results found" description={`No matches found for "${query}" with the current filter.`} />
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result, index) => {
              const Icon = getIcon(result.type);
              return (
                <div key={index} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition shadow-sm">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    {result.avatar ? (
                       <img src={result.avatar} alt="avatar" className="w-6 h-6 rounded-full" />
                    ) : (
                       <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-lg hover:text-blue-600 cursor-pointer transition-colors">{result.title}</h3>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-medium uppercase tracking-wider">
                          {result.type}
                        </span>
                      </div>
                      {result.isStudyRelated && (
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200">
                           <CheckCircle className="w-3 h-3" />
                           <span>Study-Based Approved</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{result.description}</p>
                    
                    {result.isStudyRelated && (
                       <div className="mt-3">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded cursor-pointer hover:bg-blue-100">
                             View Related Solutions
                          </span>
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}