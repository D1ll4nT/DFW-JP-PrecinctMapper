import { useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import InteractiveMap from "@/components/map/interactive-map";
import { Precinct } from "@shared/schema";

export default function Home() {
  const [selectedPrecinct, setSelectedPrecinct] = useState<Precinct | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string>("All Counties");
  const [searchCoordinates, setSearchCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-screen">
        <Sidebar
          selectedPrecinct={selectedPrecinct}
          selectedCounty={selectedCounty}
          onCountyChange={setSelectedCounty}
          onPrecinctSelect={setSelectedPrecinct}
          onSearchResult={(coordinates) => setSearchCoordinates(coordinates)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        
        <div className="flex-1 relative">
          <InteractiveMap
            selectedCounty={selectedCounty}
            selectedPrecinct={selectedPrecinct}
            searchCoordinates={searchCoordinates}
            onPrecinctSelect={setSelectedPrecinct}
            onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />
        </div>
      </div>
    </div>
  );
}
