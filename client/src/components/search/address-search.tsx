import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddressSearch } from "@/hooks/use-address-search";
import { PrecinctSearchResult } from "@shared/schema";

interface AddressSearchProps {
  onSearchResult: (result: PrecinctSearchResult) => void;
}

export default function AddressSearch({ onSearchResult }: AddressSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { searchAddress, isLoading } = useAddressSearch();

  const handleSearch = async (address: string) => {
    if (!address.trim()) return;
    
    setShowSuggestions(false);
    const result = await searchAddress(address);
    if (result) {
      onSearchResult(result);
    }
  };

  const handleInputChange = async (value: string) => {
    setSearchTerm(value);
    
    if (value.length >= 3) {
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(value)}`);
        const suggestions = await response.json();
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const exampleSearches = ["Dallas City Hall", "Fort Worth", "Plano"];

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
          className="pl-10 pr-12 py-3 text-base"
          placeholder="Enter address to find precinct..."
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-gov-light-blue" />
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Quick Search Examples */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleSearches.map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm(example);
                handleSearch(example);
              }}
              className="text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
