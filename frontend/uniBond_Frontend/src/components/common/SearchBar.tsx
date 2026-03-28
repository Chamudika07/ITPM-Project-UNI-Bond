import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { validateSearch } from "@/utils/validators";

type Props = {
  placeholder?: string;
  className?: string;
};

export default function SearchBar({ placeholder = "Search posts, users, groups...", className = "" }: Props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = validateSearch(query);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-700" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-gray-300 border border-gray-400/40 rounded-lg text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </form>
  );
}