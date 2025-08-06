import { Button } from "@/components/ui/button";

interface CountyFilterProps {
  selectedCounty: string;
  onCountyChange: (county: string) => void;
}

const counties = [
  { id: "All Counties", name: "All Counties" },
  { id: "Collin County", name: "Collin County" },
  { id: "Dallas County", name: "Dallas County" },
  { id: "Denton County", name: "Denton County" },
  { id: "Tarrant County", name: "Tarrant County" }
];

export default function CountyFilter({ selectedCounty, onCountyChange }: CountyFilterProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by County</h3>
      <div className="grid grid-cols-2 gap-2">
        {counties.map((county) => (
          <Button
            key={county.id}
            variant={selectedCounty === county.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCountyChange(county.id)}
            className={selectedCounty === county.id ? "bg-gov-light-blue hover:bg-gov-light-blue/90" : ""}
          >
            {county.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
