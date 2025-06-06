// city
export interface City {
  _id: string;
  name: string;
  region: Region["_id"]; // Référence à l'ID de la région
  createdAt: string;
  updatedAt: string;
}

export type CityPayload = Pick<City, "name" | "region">;

//region

export interface Region {
  _id: string;
  name: string;
  district: District["_id"]; // Référence à l'ID du district
  createdAt: string;
  updatedAt: string;
}

export type RegionPayload = Pick<Region, "name" | "district">;

export interface District {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type DistrictPayload = Pick<District, "name">;
