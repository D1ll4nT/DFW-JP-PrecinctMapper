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
    <div className={cn(
      "w-96 bg-white shadow-xl z-20 flex flex-col transition-transform duration-300",
      "md:translate-x-0",
      isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Search Section */}
      <div className="p-6 border-b border-gray-200">
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
      <div className="p-6 border-b border-gray-200">
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
