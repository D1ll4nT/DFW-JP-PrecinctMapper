import { MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-gov-blue text-white shadow-lg relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1583521214690-73421a1829a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=400" 
          alt="North Texas cityscape" 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">JP Precinct Finder</h1>
              <p className="text-blue-200 text-sm">North Texas Justice of the Peace Court Locator</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm font-medium">Coverage Area</div>
              <div className="text-xs text-blue-200">Collin • Dallas • Denton • Tarrant</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
