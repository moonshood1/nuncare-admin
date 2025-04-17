import axios, { AxiosError } from "axios";
import { Admin } from "../interfaces/AdminResources";

const API_URL = import.meta.env.VITE_BASE_URL;

interface AdminResponse {
  success: boolean;
  data: Admin;
}

interface StatsResponse {
  success: boolean;
  data: {
    doctors: number;
    pharmacies: number;
    ads: number;
    medecines: number;
    regions: number;
    cities: number;
    articles: number;
    specilities: number;
    kyc: number;
  };
}

interface NotificationResponse {
  success: boolean;
  data: Notification[];
}

class AdminController {
  private static instance: AdminController;
  readonly token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem("token");
  }

  public static getInstance(): AdminController {
    if (!AdminController.instance) {
      AdminController.instance = new AdminController();
    }
    return AdminController.instance;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  public async getMe(): Promise<AdminResponse> {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: this.getHeaders(),
      });
      console.log(response.data);

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des informations de l'administrateur"
      );
    }
  }

  public async getMyNotifications(): Promise<NotificationResponse> {
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
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
        "Une erreur s'est produite pendant la récupération des notifications"
      );
    }
  }

  public async getMainStats(): Promise<StatsResponse> {
    try {
      const response = await axios.get(`${API_URL}/main-stats`, {
        headers: this.getHeaders(),
      });
      console.log(response.data);

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des données statistiques"
      );
    }
  }
}

export const adminController = AdminController.getInstance();
