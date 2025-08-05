import { z } from "zod";

export const precinctSchema = z.object({
  id: z.string(),
  name: z.string(),
  county: z.string(),
  precinct_number: z.string(),
  geometry: z.object({
    type: z.literal("Polygon"),
    coordinates: z.array(z.array(z.array(z.number())))
  })
});

export const precinctSearchResultSchema = z.object({
  precinct: precinctSchema.nullable(),
  address: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).nullable()
});

export type Precinct = z.infer<typeof precinctSchema>;
export type PrecinctSearchResult = z.infer<typeof precinctSearchResultSchema>;

export const addressSearchSchema = z.object({
  address: z.string().min(1, "Address is required")
});

export type AddressSearch = z.infer<typeof addressSearchSchema>;
