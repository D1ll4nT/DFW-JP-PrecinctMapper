import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PrecinctSearchResult } from "@shared/schema";

export function useAddressSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchAddress = async (address: string): Promise<PrecinctSearchResult | null> => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/search/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const result: PrecinctSearchResult = await response.json();
      
      if (result.precinct) {
        toast({
          title: "Precinct Found",
          description: `Found ${result.precinct.name}`,
        });
      } else {
        toast({
          title: "No Precinct Found",
          description: "No precinct found for this address",
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search for address",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { searchAddress, isLoading };
}
