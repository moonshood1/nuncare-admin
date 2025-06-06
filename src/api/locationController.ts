import axios, { AxiosError } from "axios";
import {
  City,
  CityPayload,
  District,
  DistrictPayload,
  Region,
  RegionPayload,
} from "../interfaces/Location";

const API_URL = import.meta.env.VITE_BASE_URL;

interface CitiesResponse {
  success: boolean;
  data: City[];
}

interface RegionsResponse {
  success: boolean;
  data: Region[];
}

interface DistrictsResponse {
  success: boolean;
  data: District[];
}

interface BasicResponse {
  success: boolean;
  message: string;
}

class LocationController {
  private static instance: LocationController;
  readonly token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem("token");
  }

  public static getInstance(): LocationController {
    if (!LocationController.instance) {
      LocationController.instance = new LocationController();
    }
    return LocationController.instance;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  public async getDistricts(): Promise<DistrictsResponse> {
    try {
      const response = await axios.get(`${API_URL}/district`, {
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
        "Une erreur s'est produite pendant la récupération des districts"
      );
    }
  }

  public async createDistrict(data: DistrictPayload): Promise<BasicResponse> {
    try {
      const response = await axios.post(`${API_URL}/district-create`, data, {
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
        "Une erreur s'est produite pendant la création du district"
      );
    }
  }

  public async updateDistrict({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> {
    try {
      const response = await axios.put(
        `${API_URL}/district-update?id=${id}`,
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
        "Une erreur s'est produite pendant la modification du district"
      );
    }
  }

  public async getRegions({
    limit,
    name,
  }: {
    limit: number;
    name?: string;
  }): Promise<RegionsResponse> {
    try {
      let queryAdded = "";
      if (name) {
        queryAdded = `&name=${name}`;
      }
      const response = await axios.get(
        `${API_URL}/region?limit=${limit}${queryAdded}`,
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
        "Une erreur s'est produite pendant la récupération des régions"
      );
    }
  }

  public async createRegion(data: RegionPayload): Promise<BasicResponse> {
    try {
      const response = await axios.post(`${API_URL}/region-create`, data, {
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
        "Une erreur s'est produite pendant la création de la région"
      );
    }
  }

  public async updateRegion({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> {
    try {
      const response = await axios.put(
        `${API_URL}/region-update?id=${id}`,
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
        "Une erreur s'est produite pendant la modification de la région"
      );
    }
  }

  public async deleteRegion(id: string): Promise<BasicResponse> {
    try {
      const response = await axios.delete(`${API_URL}/region-delete?id=${id}`, {
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
        "Une erreur s'est produite pendant la suppression de la région"
      );
    }
  }

  public async getCities({
    limit,
    name,
  }: {
    limit: number;
    name?: string;
  }): Promise<CitiesResponse> {
    try {
      let queryAdded = "";
      if (name) {
        queryAdded = `&name=${name}`;
      }

      const response = await axios.get(
        `${API_URL}/city?limit=${limit}${queryAdded}`,
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
        "Une erreur s'est produite pendant la récupération des villes"
      );
    }
  }

  public async getCitiesForSelectedRegion(
    region: string
  ): Promise<CitiesResponse> {
    try {
      const response = await axios.get(
        `${API_URL}/cities-with-region?regionName=${region}`,
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
        "Une erreur s'est produite pendant la récupération des villes"
      );
    }
  }

  public async createCity(data: CityPayload): Promise<BasicResponse> {
    try {
      const response = await axios.post(`${API_URL}/city-create`, data, {
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
        "Une erreur s'est produite pendant la création de la ville"
      );
    }
  }

  public async updateCity({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> {
    try {
      const response = await axios.put(
        `${API_URL}/city-update?id=${id}`,
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
        "Une erreur s'est produite pendant la modification de la ville"
      );
    }
  }

  public async deleteCity(id: string): Promise<BasicResponse> {
    try {
      const response = await axios.delete(`${API_URL}/city-delete?id=${id}`, {
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
        "Une erreur s'est produite pendant la suppression de la ville"
      );
    }
  }
}

export const locationController = LocationController.getInstance();
