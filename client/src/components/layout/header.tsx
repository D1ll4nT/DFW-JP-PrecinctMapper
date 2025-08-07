import { MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg relative overflow-hidden">
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Background overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1583521214690-73421a1829a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=400" 
          alt="North Texas cityscape" 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-3 lg:px-4 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-25 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white border-opacity-20">
              <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-lg lg:text-3xl font-bold text-white drop-shadow-md">JP Precinct Finder</h1>
              <p className="text-blue-100 text-xs lg:text-base font-medium drop-shadow-sm">North Texas Justice of the Peace Court Locator</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-6">
            <div className="text-right bg-black bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white border-opacity-10">
              <div className="text-xs lg:text-sm font-semibold text-white drop-shadow-sm">Coverage Area</div>
              <div className="text-xs lg:text-sm text-blue-100 font-medium drop-shadow-sm">Collin • Dallas • Denton • Tarrant</div>
            </div>
          </div>
          
          <div className="sm:hidden text-right bg-black bg-opacity-20 backdrop-blur-sm rounded-lg px-2 py-1 border border-white border-opacity-10">
            <div className="text-xs font-semibold text-white drop-shadow-sm">4 Counties</div>
            <div className="text-xs text-blue-100 font-medium drop-shadow-sm">23 Precincts</div>
          </div>
        </div>
      </div>
    </header>
  );
}
