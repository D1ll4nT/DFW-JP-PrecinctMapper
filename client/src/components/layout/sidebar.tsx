import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AddressSearch from "@/components/search/address-search";
import CountyFilter from "@/components/search/county-filter";
import PrecinctInfo from "@/components/precinct/precinct-info";
import { Precinct } from "@shared/schema";

interface SidebarProps {
  selectedPrecinct: Precinct | null;
  selectedCounty: string;
  onCountyChange: (county: string) => void;
  onPrecinctSelect: (precinct: Precinct | null) => void;
  onSearchResult: (coordinates: {lat: number, lng: number} | null) => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

export default function Sidebar({
  selectedPrecinct,
  selectedCounty,
  onCountyChange,
  onPrecinctSelect,
  onSearchResult,
  isMobileOpen,
  onMobileToggle
}: SidebarProps) {
  return (
    <div className="w-full h-full bg-white shadow-xl z-20 flex flex-col">
      {/* Mobile Header with Close Button */}
      {isMobileOpen && (
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="text-lg font-semibold text-gray-900">JP Precinct Finder</h2>
          <Button variant="ghost" size="sm" onClick={onMobileToggle}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
      
      {/* Search Section */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <AddressSearch 
          onSearchResult={(result) => {
            if (result.precinct) {
              onPrecinctSelect(result.precinct);
            }
            onSearchResult(result.coordinates);
          }}
        />
      </div>

      {/* County Filter */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <CountyFilter 
          selectedCounty={selectedCounty}
          onCountyChange={onCountyChange}
        />
      </div>

      {/* Precinct Information Panel */}
      <div className="flex-1 overflow-y-auto">
        <PrecinctInfo 
          selectedPrecinct={selectedPrecinct}
          onClose={() => onPrecinctSelect(null)}
        />
      </div>
    </div>
  );
}
