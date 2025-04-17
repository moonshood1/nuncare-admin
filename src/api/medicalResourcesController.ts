import axios, { AxiosError } from "axios";
import {
  Area,
  Medecine,
  MedecinePayload,
  Pharmacy,
  PharmacyExport,
  Section,
} from "../interfaces/MedicalResources";

const API_URL = import.meta.env.VITE_BASE_URL;

interface PharmaciesResponse {
  success: boolean;
  data: Pharmacy[];
}

interface PharmaciesExportResponse {
  success: true;
  data: PharmacyExport[];
}

interface MedecinesResponse {
  success: boolean;
  data: Medecine[];
}

interface BasicResponse {
  success: boolean;
  message: string;
}

interface MedecinesAttributesResponse {
  success: boolean;
  data: {
    dcis: string[];
    categories: string[];
    groups: string[];
    regimes: string[];
  };
}

interface AreasResponse {
  success: boolean;
  data: Area[];
}

interface SectionsResponse {
  success: boolean;
  data: Section[];
}

class MedicalResourcesController {
  private static instance: MedicalResourcesController;
  readonly token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem("token");
  }

  public static getInstance(): MedicalResourcesController {
    if (!MedicalResourcesController.instance) {
      MedicalResourcesController.instance = new MedicalResourcesController();
    }
    return MedicalResourcesController.instance;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  public async getPharmacies({
    queryParams,
  }: {
    queryParams: string;
  }): Promise<PharmaciesResponse> {
    try {
      const response = await axios.get(`${API_URL}/pharmacy?${queryParams}`, {
        headers: this.getHeaders(),
      });

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des pharmacies"
      );
    }
  }

  public async getPharmaciesForExport(): Promise<PharmaciesExportResponse> {
    try {
      const response = await axios.get(`${API_URL}/pharmacy-export`, {
        headers: this.getHeaders(),
      });

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des pharmacies"
      );
    }
  }

  public async createPharmacy(data: FormData): Promise<BasicResponse> {
    try {
      const response = await axios.post(`${API_URL}/pharmacy-create`, data, {
        headers: {
          ...this.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      const { success, message } = response.data;

      return { success, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant l'opération d'ajout de pharmacies"
      );
    }
  }

  public async updateGuardPharmacy(data: FormData): Promise<BasicResponse> {
    try {
      const response = await axios.put(
        `${API_URL}/pharmacy-guard-update`,
        data,
        {
          headers: {
            ...this.getHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { success, message } = response.data;

      return { success, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant l'opération de mise à jour des pharmacies de garde"
      );
    }
  }

  public async updatePharmacy({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> {
    try {
      const response = await axios.put(
        `${API_URL}/pharmacy-update?id=${id}`,
        data,
        {
          headers: this.getHeaders(),
        }
      );

      const { success, message } = response.data;
      return { success, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la modification des données de la pharmacie"
      );
    }
  }

  public async deletePharmacy(id: string): Promise<BasicResponse> {
    try {
      const response = await axios.delete(
        `${API_URL}/pharmacy-delete?id=${id}`,
        {
          headers: this.getHeaders(),
        }
      );

      const { success, message } = response.data;

      return { success, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la suppression de la pharmacie"
      );
    }
  }

  public async getAreas(): Promise<AreasResponse> {
    try {
      const response = await axios.get(`${API_URL}/pharmacy-areas`, {
        headers: this.getHeaders(),
      });

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des zones de pharmacies"
      );
    }
  }

  public async getSections(): Promise<SectionsResponse> {
    try {
      const response = await axios.get(`${API_URL}/pharmacy-sections`, {
        headers: this.getHeaders(),
      });

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des sections de pharmacies"
      );
    }
  }

  public async getMedecines({
    queryParams,
  }: {
    queryParams: string;
  }): Promise<MedecinesResponse> {
    try {
      const response = await axios.get(`${API_URL}/medecine?${queryParams}`, {
        headers: this.getHeaders(),
      });

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des médicaments"
      );
    }
  }

  public async getMedecinesAttributes(): Promise<MedecinesAttributesResponse> {
    try {
      const response = await axios.get(`${API_URL}/medecine-attributes`, {
        headers: this.getHeaders(),
      });

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des attributs des médicaments"
      );
    }
  }

  public async createMedecine(data: FormData): Promise<BasicResponse> {
    try {
      const response = await axios.post(`${API_URL}/medecine-create`, data, {
        headers: {
          ...this.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      const { success, message } = response.data;

      return { success, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la création des médicament"
      );
    }
  }

  public async createMedecineBulk({
    data,
  }: {
    data: MedecinePayload[];
  }): Promise<BasicResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/medecine-create-bulk`,
        data,
        {
          headers: this.getHeaders(),
        }
      );

      const { success, message } = response.data;

      return { success, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la création des médicaments en lot"
      );
    }
  }

  public async updateMedecine({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> {
    try {
      const response = await axios.put(
        `${API_URL}/medecine-update?id=${id}`,
        data,
        {
          headers: this.getHeaders(),
        }
      );

      const { success, message } = response.data;
      return { success, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la modification des données du médicament"
      );
    }
  }

  public async deleteMedecine(id: string): Promise<BasicResponse> {
    try {
      const response = await axios.delete(
        `${API_URL}/medecine-delete?id=${id}`,
        {
          headers: this.getHeaders(),
        }
      );

      const { success, message } = response.data;

      return { success, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la suppression du médicament"
      );
    }
  }
}

export const medicalResourcesController =
  MedicalResourcesController.getInstance();
