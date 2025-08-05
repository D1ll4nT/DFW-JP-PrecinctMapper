import { useQuery } from "@tanstack/react-query";
import { Precinct } from "@shared/schema";

export function usePrecinctData(county: string = "all") {
  return useQuery<Precinct[]>({
    queryKey: ["/api/precincts", county === "all" ? "" : "county", county === "all" ? "" : county].filter(Boolean),
    enabled: true,
  });
}
