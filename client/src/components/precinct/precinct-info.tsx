import { X, MapPin, Users, DollarSign, TrendingDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Precinct } from "@shared/schema";

interface PrecinctInfoProps {
  selectedPrecinct: Precinct | null;
  onClose: () => void;
}

export default function PrecinctInfo({ selectedPrecinct, onClose }: PrecinctInfoProps) {
  if (!selectedPrecinct) {
    return (
      <div className="p-6 text-center">
        <img 
          src="https://pixabay.com/get/g0a8a5fc4a7002414e1092d5b891a56a3ed7d33155a352638c9abb03f1ba53b440b9e141eedc49c08d417b33d247930415c59bf330ca32b13284a6e71c4e08e1d_1280.jpg" 
          alt="Government building exterior" 
          className="mx-auto rounded-lg mb-4 shadow-md max-w-full h-32 object-cover" 
        />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Your JP Precinct</h3>
        <p className="text-gray-600 text-sm mb-4">
          Enter an address above or click on the map to identify which Justice of the Peace precinct serves your area.
        </p>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <h4 className="font-medium text-gov-blue mb-2">Coverage Area</h4>
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatPercentage = (num: number) => {
    return (num * 100).toFixed(1) + '%';
  };

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
            <CardTitle className="text-gov-blue flex items-center gap-2">
              <Users className="w-5 h-5" />
              Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Population</div>
                <div className="font-semibold text-lg">{formatNumber(selectedPrecinct.population)}</div>
              </div>
              <div>
                <div className="text-gray-600">Rental Households</div>
                <div className="font-semibold text-lg">{formatNumber(selectedPrecinct.rental_households)}</div>
              </div>
              <div>
                <div className="text-gray-600 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Median Income
                </div>
                <div className="font-semibold text-lg">{formatCurrency(selectedPrecinct.median_household_income)}</div>
              </div>
              <div>
                <div className="text-gray-600 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Poverty Rate
                </div>
                <div className="font-semibold text-lg">{formatPercentage(selectedPrecinct.poverty_rate)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card className="bg-gray-50 border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Court Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              This precinct is served by the Justice of the Peace Court for {selectedPrecinct.county}.
            </p>
            <Button className="w-full bg-gov-blue hover:bg-gov-blue/90">
              Contact Court Information
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
