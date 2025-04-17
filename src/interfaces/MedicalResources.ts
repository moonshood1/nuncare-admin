// medecines
export interface Medecine {
  _id: string;
  code: string;
  name: string;
  group: string;
  dci: string;
  category: string;
  regime: string;
  img?: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export type MedecinePayload = Pick<
  Medecine,
  "code" | "category" | "dci" | "group" | "name" | "price" | "regime"
>;

export interface MedecineInit {
  code: "";
  name: "";
  group: "";
  dci: "";
  regime: "";
  price: 0;
}

// pharmacies
export interface Pharmacy {
  _id: string;
  area: string;
  code: string;
  section: string;
  name: string;
  address: string;
  lng: number;
  lat: number;
  phone: string;
  img?: string;
  owner: string;
  isGuard: boolean;
  guardPeriod: string;
  createdAt: string;
  updatedAt: string;
}

export type PharmacyPayload = Pick<
  Pharmacy,
  "area" | "section" | "name" | "address" | "lng" | "lat" | "phone" | "owner"
>;

export type PharmacyExport = Pick<
  Pharmacy,
  | "code"
  | "name"
  | "section"
  | "area"
  | "address"
  | "lng"
  | "lat"
  | "phone"
  | "owner"
  | "isGuard"
>;

// Area

export interface Area {
  _id: string;
  name: string;
  section: Section["_id"];
}

export interface Section {
  _id: string;
  name: string;
}
