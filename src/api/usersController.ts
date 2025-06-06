import axios, { AxiosError } from "axios";
import {
  AccountDeletion,
  Speciality,
  SpecialityPayload,
  User,
  Verification,
} from "../interfaces/Doctors";

const API_URL = import.meta.env.VITE_BASE_URL;

interface DoctorsResponse {
  success: boolean;
  data: User[];
}

interface DoctorsPaginatedResponse {
  success: boolean;
  data: User[];
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

interface KycResponse {
  success: boolean;
  data: Verification[];
}

interface AccountDeletionResponse {
  success: boolean;
  data: AccountDeletion[];
}

interface SpecialityResponse {
  success: boolean;
  data: Speciality[];
}

interface BasicResponse {
  success: boolean;
  message: string;
}

class UsersController {
  private static instance: UsersController;
  readonly token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem("token");
  }

  public static getInstance(): UsersController {
    if (!UsersController.instance) {
      UsersController.instance = new UsersController();
    }
    return UsersController.instance;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  public async getDoctors({
    limit,
  }: {
    limit: number;
  }): Promise<DoctorsResponse> {
    try {
      const response = await axios.get(`${API_URL}/doctors?limit=${limit}`, {
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
        "Une erreur s'est produite pendant la récupération des docteurs"
      );
    }
  }

  public async getDoctorsPaginated({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }): Promise<DoctorsPaginatedResponse> {
    try {
      const response = await axios.get(
        `${API_URL}/doctors-paginated?limit=${limit}&page=${page}`,
        {
          headers: this.getHeaders(),
        }
      );

      const { data, success, meta } = response.data;

      return { success, data, meta };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des docteurs"
      );
    }
  }

  public async getDoctorsWithParameters({
    queryParams,
  }: {
    queryParams: string;
  }): Promise<DoctorsResponse> {
    try {
      const response = await axios.get(
        `${API_URL}/doctors-with-params?${queryParams}`,
        {
          headers: this.getHeaders(),
        }
      );
      console.log(response.data);

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des docteurs"
      );
    }
  }

  public async updateDoctor({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> {
    try {
      const response = await axios.put(
        `${API_URL}/doctors-update?id=${id}`,
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
        "Une erreur s'est produite pendant la modification des données du docteur"
      );
    }
  }

  public async deleteDoctor(id: string): Promise<BasicResponse> {
    try {
      const response = await axios.delete(
        `${API_URL}/doctors-delete?id=${id}`,
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
        "Une erreur s'est produite pendant la suppression du docteur"
      );
    }
  }

  public async getSpecialities(limit: number): Promise<SpecialityResponse> {
    try {
      const response = await axios.get(`${API_URL}/speciality?limit=${limit}`, {
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
        "Une erreur s'est produite pendant la récupération des spécialités"
      );
    }
  }

  public async getSpecialitiesWithParams({
    queryParams,
  }: {
    queryParams: string;
  }): Promise<SpecialityResponse> {
    try {
      const response = await axios.get(
        `${API_URL}/specialities-with-params?${queryParams}`,
        {
          headers: this.getHeaders(),
        }
      );

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des spécialités"
      );
    }
  }

  public async createSpeciality(
    data: SpecialityPayload
  ): Promise<BasicResponse> {
    try {
      const response = await axios.post(`${API_URL}/speciality-create`, data, {
        headers: this.getHeaders(),
      });

      const { success, message } = response.data;

      return { success, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la création de la specialité"
      );
    }
  }

  public async updateSpeciality({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> {
    try {
      const response = await axios.put(
        `${API_URL}/speciality-update?id=${id}`,
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
        "Une erreur s'est produite pendant la modification de la spécialité"
      );
    }
  }

  public async deleteSpeciality(id: string): Promise<BasicResponse> {
    try {
      const response = await axios.delete(
        `${API_URL}/speciality-delete?id=${id}`,
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
        "Une erreur s'est produite pendant la suppression de la spécialité"
      );
    }
  }

  public async getKycRequests(
    limit: number,
    status: string
  ): Promise<KycResponse> {
    try {
      const response = await axios.get(
        `${API_URL}/requests/kyc-submission?limit=${limit}&status=${status}`,
        {
          headers: this.getHeaders(),
        }
      );
      console.log(response.data);

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des requetes KYC"
      );
    }
  }

  public async updateKycRequest({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> {
    try {
      const response = await axios.put(
        `${API_URL}/requests/kyc-submission?id=${id}`,
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
        "Une erreur s'est produite pendant le traitement de la requete KYC"
      );
    }
  }
  public async getDeletionsRequests(
    limit: number,
    status: string
  ): Promise<AccountDeletionResponse> {
    try {
      const response = await axios.get(
        `${API_URL}/requests/account-deletions?limit=${limit}&status=${status}`,
        {
          headers: this.getHeaders(),
        }
      );
      console.log(response.data);

      const { data, success } = response.data;

      return { success, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error(
        "Une erreur s'est produite pendant la récupération des requetes de suppression de compte"
      );
    }
  }

  public async updateDeletionAccountRequests({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> {
    try {
      const response = await axios.put(
        `${API_URL}/requests/account-deletions?id=${id}`,
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
        "Une erreur s'est produite pendant le traitement de la requete de suppression de compte"
      );
    }
  }
}

export const usersController = UsersController.getInstance();
