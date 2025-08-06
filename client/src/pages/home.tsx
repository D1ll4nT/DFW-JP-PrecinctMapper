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
      
      <div className="flex h-screen relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            selectedPrecinct={selectedPrecinct}
            selectedCounty={selectedCounty}
            onCountyChange={setSelectedCounty}
            onPrecinctSelect={setSelectedPrecinct}
            onSearchResult={(result) => {
              if (result.coordinates) {
                setSearchCoordinates(result.coordinates);
              }
              if (result.precinct) {
                setSelectedPrecinct(result.precinct);
              }
            }}
            isMobileOpen={false}
            onMobileToggle={() => {}}
          />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileSidebarOpen(false)} />
            <div className="relative w-80 max-w-xs bg-white h-full shadow-xl">
              <Sidebar
                selectedPrecinct={selectedPrecinct}
                selectedCounty={selectedCounty}
                onCountyChange={setSelectedCounty}
                onPrecinctSelect={setSelectedPrecinct}
                onSearchResult={(result) => {
                  if (result.coordinates) {
                    setSearchCoordinates(result.coordinates);
                  }
                  if (result.precinct) {
                    setSelectedPrecinct(result.precinct);
                  }
                  setIsMobileSidebarOpen(false);
                }}
                isMobileOpen={true}
                onMobileToggle={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 relative">
          <InteractiveMap
            selectedCounty={selectedCounty}
            selectedPrecinct={selectedPrecinct}
            searchCoordinates={searchCoordinates}
            onPrecinctSelect={(precinct) => {
              setSelectedPrecinct(precinct);
              // On mobile, show sidebar when a precinct is selected
              if (window.innerWidth < 1024) {
                setIsMobileSidebarOpen(true);
              }
            }}
            onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />
        </div>
      </div>
    </div>
  );
}
