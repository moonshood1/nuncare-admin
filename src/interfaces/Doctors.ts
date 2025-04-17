// users
export interface User {
  _id: string;
  firebaseId: string;
  email: string;
  firstName: string;
  lastName: string;
  district: string;
  region: string;
  city: string;
  address: string;
  img: string;
  hospital: string;
  speciality: string;
  specialities: string[];
  university: string;
  countryUniversity: string;
  phone: string;
  isPhoneHidden: boolean;
  lat: number;
  lng: number;
  years: number;
  bio: string;
  sex: string;
  isActive: boolean;
  orderNumber: string;
  isOrderNumberHidden: boolean;
  deviceId: string;
  promotion: string;
  kycStatus: string;
  createdAt: string;
  updatedAt: string;
}

// kyc requests

export interface Verification {
  _id: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentType: string;
  recto: string;
  verso: string;
  picture: string;
  user: User["_id"]; // Référence à l'ID de l'utilisateur
  status: string; // Statut du KYC, basé sur les clés de KYC_STATUSES
  createdAt: string;
  updatedAt: string;
}

// account deletions

export interface AccountDeletion {
  _id: string;
  userId: User["_id"]; // Référence à l'ID de l'utilisateur
  reason: string | null;
  status: "PENDING" | "APPROVED";
  email: string;
  firstName: string;
  lastName: string;
  phone: string; // Statut de suppression, limité aux valeurs possibles
  createdAt: string;
  updatedAt: string;
}

// Specialities

export interface Speciality {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type SpecialityPayload = Pick<Speciality, "name">;
