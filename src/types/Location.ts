export type LocationId = number;

export interface Location {
  id: LocationId;
  name: string;
  standalone: {
    id: LocationId;
    name: string;
    region: string;
    country: string;
  };
}

export type LocationSelect = Omit<Location, "standalone">;
export type LocationStandaloneSelect = Pick<Location, "standalone">;
