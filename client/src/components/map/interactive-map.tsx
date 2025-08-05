import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import { RotateCcw, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Precinct } from "@shared/schema";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAzMS4wMjg1IDAgMzguNDI4NkMwIDM5LjUzMzEgMC44OTU0MyA0MC40Mjg2IDIgNDAuNDI4NkMyMy40Mjg2IDQwLjQyODYgMjMgMzkuNTMzMSAyMyAzOC40Mjg2QzIzIDMxLjAyODUgMTcuNDAzNiAyNSAxMC41IDI1QzMuNTk2NDQgMjUgLTIgMTkuNDAzNiAtMiAxMi41Qy0yIDUuNTk2NDQgMy41OTY0NCAwIDEwLjUgMEgxMi41WiIgZmlsbD0iIzMzNzNkYyIvPgo8L3N2Zz4K',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAzMS4wMjg1IDAgMzguNDI4NkMwIDM5LjUzMzEgMC44OTU0MyA0MC40Mjg2IDIgNDAuNDI4NkMyMy40Mjg2IDQwLjQyODYgMjMgMzkuNTMzMSAyMyAzOC40Mjg2QzIzIDMxLjAyODUgMTcuNDAzNiAyNSAxMC41IDI1QzMuNTk2NDQgMjUgLTIgMTkuNDAzNiAtMiAxMi41Qy0yIDUuNTk2NDQgMy41OTY0NCAwIDEwLjUgMEgxMi41WiIgZmlsbD0iIzMzNzNkYyIvPgo8L3N2Zz4K',
  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIyMC41IiByeD0iMjAuNSIgcnk9IjIwLjUiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4K',
});

interface InteractiveMapProps {
  selectedCounty: string;
  selectedPrecinct: Precinct | null;
  searchCoordinates: {lat: number, lng: number} | null;
  onPrecinctSelect: (precinct: Precinct) => void;
  onMobileToggle: () => void;
}

const countyColors: Record<string, string> = {
  'Collin County': '#3b82f6',
  'Dallas County': '#10b981', 
  'Denton County': '#f59e0b',
  'Tarrant County': '#8b5cf6'
};

function MapController({ searchCoordinates }: { searchCoordinates: {lat: number, lng: number} | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (searchCoordinates) {
      map.setView([searchCoordinates.lat, searchCoordinates.lng], 12);
    }
  }, [searchCoordinates, map]);

  return null;
}

export default function InteractiveMap({
  selectedCounty,
  selectedPrecinct,
  searchCoordinates,
  onPrecinctSelect,
  onMobileToggle
}: InteractiveMapProps) {
  const { data: allPrecincts, isLoading } = useQuery<Precinct[]>({
    queryKey: ['/api/precincts'],
  });
  
  const precincts = selectedCounty === 'All Counties' 
    ? allPrecincts 
    : allPrecincts?.filter(p => p.county === selectedCounty);
    
  const mapRef = useRef<L.Map | null>(null);
  const [highlightedPrecinct, setHighlightedPrecinct] = useState<string | null>(null);

  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.setView([32.8, -97.0], 9);
    }
  };

  const getPrecinctStyle = (precinct: Precinct) => {
    const color = countyColors[precinct.county] || '#6b7280';
    const isHighlighted = highlightedPrecinct === precinct.id || selectedPrecinct?.id === precinct.id;
    
    return {
      fillColor: color,
      weight: isHighlighted ? 4 : 2,
      opacity: 0.8,
      color: color,
      fillOpacity: isHighlighted ? 0.6 : 0.2,
    };
  };

  const onEachFeature = (precinct: Precinct, layer: L.Layer) => {
    if (layer instanceof L.Path) {
      layer.on({
        mouseover: () => {
          setHighlightedPrecinct(precinct.id);
        },
        mouseout: () => {
          setHighlightedPrecinct(null);
        },
        click: () => {
          onPrecinctSelect(precinct);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gov-light-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading precinct boundaries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <MapContainer
        center={[32.8, -97.0]}
        zoom={9}
        className="h-full w-full"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController searchCoordinates={searchCoordinates} />

        {precincts?.map((precinct) => (
          <GeoJSON
            key={precinct.id}
            data={{
              type: "Feature",
              properties: precinct,
              geometry: precinct.geometry
            }}
            style={() => getPrecinctStyle(precinct)}
            onEachFeature={(feature, layer) => onEachFeature(precinct, layer)}
          >
            <Popup>
              <div className="min-w-[200px] max-w-[280px] p-3 text-center">
                <h3 className="font-bold text-base lg:text-lg text-gray-900 mb-2">{precinct.name}</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{precinct.county}</p>
                  <p>Precinct #{precinct.precinct_number}</p>
                </div>
                <div className="mt-3 lg:hidden">
                  <button 
                    onClick={() => onPrecinctSelect(precinct)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </GeoJSON>
        ))}

        {searchCoordinates && (
          <Marker position={[searchCoordinates.lat, searchCoordinates.lng]}>
            <Popup>
              <div className="text-center">
                <strong>Search Result</strong>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Legend - Hidden on small mobile screens */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 lg:p-4 z-20 max-w-xs hidden sm:block">
        <h4 className="font-semibold text-sm mb-3 text-gray-900">North Texas JP Precincts</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: countyColors['Collin County'] }}></div>
            <span className="text-gray-700">Collin County</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: countyColors['Dallas County'] }}></div>
            <span className="text-gray-700">Dallas County</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: countyColors['Denton County'] }}></div>
            <span className="text-gray-700">Denton County</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: countyColors['Tarrant County'] }}></div>
            <span className="text-gray-700">Tarrant County</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetMapView}
            title="Reset Map View"
            className="w-full justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset View
          </Button>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="lg:hidden">
        {/* Mobile Toggle Button */}
        <Button
          className="fixed top-20 left-4 z-30 bg-white text-gray-600 shadow-lg hover:bg-gray-50"
          variant="outline"
          size="sm"
          onClick={onMobileToggle}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {/* Mobile Reset Button */}
        <Button
          className="fixed top-20 right-4 z-30 bg-white text-gray-600 shadow-lg hover:bg-gray-50"
          variant="outline"
          size="sm"
          onClick={resetMapView}
          title="Reset Map View"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
