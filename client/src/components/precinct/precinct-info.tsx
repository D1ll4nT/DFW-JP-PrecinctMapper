import { X, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Precinct } from "@shared/schema";

interface PrecinctInfoProps {
  selectedPrecinct: Precinct | null;
  onClose: () => void;
}

export default function PrecinctInfo({ selectedPrecinct, onClose }: PrecinctInfoProps) {
  if (!selectedPrecinct) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Your JP Precinct</h3>
        <p className="text-gray-600 text-sm mb-4">
          Enter an address above or click on the map to identify which Justice of the Peace precinct serves your area.
        </p>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <h4 className="font-medium text-blue-700 mb-2">Coverage Area</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• <strong>Collin County:</strong> 4 precincts</div>
              <div>• <strong>Dallas County:</strong> 5 precincts</div>
              <div>• <strong>Denton County:</strong> 6 precincts</div>
              <div>• <strong>Tarrant County:</strong> 8 precincts</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 slide-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPrecinct.name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            {selectedPrecinct.county} • Precinct {selectedPrecinct.precinct_number}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Justice of the Peace Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700">
              <p className="mb-2">
                <strong>Jurisdiction:</strong> {selectedPrecinct.county}
              </p>
              <p className="mb-2">
                <strong>Precinct Number:</strong> {selectedPrecinct.precinct_number}
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Justice of the Peace courts handle small claims, traffic violations, 
                and other local legal matters for residents within this precinct boundary.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Boundary Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700">
              <p className="mb-2">
                This precinct covers a specific geographic area within {selectedPrecinct.county}.
              </p>
              <p className="text-xs text-gray-500">
                Use the address search above to confirm if a specific location falls within this precinct's jurisdiction.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}