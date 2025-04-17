import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface RefreshTokenResponse {
  token: string;
}

class AuthController {
  private static instance: AuthController;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem("token");
  }

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const { token, user } = response.data;
      this.token = token;
      localStorage.setItem("token", token);
      return { token, user };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(
          axiosError.response?.data?.message || "Connexion echouée"
        );
      }
      throw new Error(
        "Une erreur s'est produite pendant le processus de connexion"
      );
    }
  }

  public async logout(): Promise<void> {
    try {
      if (this.token) {
        await axios.post(
          `${API_URL}/logout`,
          {},
          { headers: this.getHeaders() }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.token = null;
      localStorage.removeItem("token");
    }
  }

  public async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/refresh-token`,
        {},
        { headers: this.getHeaders() }
      );
      const { token } = response.data;
      this.token = token;
      localStorage.setItem("token", token);
      return { token };
    } catch (error) {
      this.token = null;
      localStorage.removeItem("token");
      throw new Error("Token refresh failed");
    }
  }

  public async getUserInfo(): Promise<AuthResponse["user"]> {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          this.token = null;
          localStorage.removeItem("token");
        }
      }
      throw new Error("Failed to fetch user information");
    }
  }

  public async resetPassword(email: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/reset-password`, { email });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(
          axiosError.response?.data?.message ||
            "Echec pendant le processus de réinitisalisation"
        );
      }
      throw new Error(
        "Une erreur s'est produite lors du processus de réinitisalisation du mot de passe"
      );
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authController = AuthController.getInstance();
