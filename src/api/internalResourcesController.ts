import {
  Ad,
  AdPayload,
  Article,
  ArticlePayload,
  Notification,
  NotificationPayload,
} from "../interfaces/InternalResources";
import apiService from "./apiService";

interface AdsResponse {
  success: boolean;
  data: Ad[];
}

interface ArticlesResponse {
  success: boolean;
  data: Article[];
}

interface BasicResponse {
  success: boolean;
  message: string;
}

interface NotificationsPaginatedResponse {
  success: boolean;
  data: Notification[];
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

class InterResourcesController {
  private static instance: InterResourcesController;

  private constructor() {}

  public static getInstance(): InterResourcesController {
    if (!InterResourcesController.instance) {
      InterResourcesController.instance = new InterResourcesController();
    }
    return InterResourcesController.instance;
  }

  // Créer une publicité
  createAd = (data: AdPayload): Promise<BasicResponse> => {
    return apiService.post<BasicResponse>("/ads-create", data);
  };

  // Mettre à jour une publicité
  updateAd = ({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> => {
    return apiService.put<BasicResponse>(`/ads-update?id=${id}`, data);
  };

  // Supprimer une publicité
  deleteAd = (id: string): Promise<BasicResponse> => {
    return apiService.delete<BasicResponse>(`/ads-delete?id=${id}`);
  };

  // Récupérer les publicités
  getAds = ({
    queryParams,
  }: {
    queryParams?: string;
  }): Promise<AdsResponse> => {
    return apiService.get<AdsResponse>(`/ads?${queryParams}`);
  };

  // Créer un article
  createArticle = (data: ArticlePayload): Promise<BasicResponse> => {
    return apiService.post<BasicResponse>("/articles-create", data);
  };

  // Mettre à jour un article
  updateArticle = ({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> => {
    return apiService.put<BasicResponse>(`/articles-update?id=${id}`, data);
  };

  // Supprimer un article
  deleteArticle = (id: string): Promise<BasicResponse> => {
    return apiService.delete<BasicResponse>(`/articles-delete?id=${id}`);
  };

  // Récupérer les articles
  getArticles = ({
    queryParams,
  }: {
    queryParams?: string;
  }): Promise<ArticlesResponse> => {
    return apiService.get<ArticlesResponse>(`/articles?${queryParams}`);
  };

  getNotifications = ({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }): Promise<NotificationsPaginatedResponse> => {
    return apiService.get<NotificationsPaginatedResponse>(
      `/notifications?limit=${limit}&page=${page}`
    );
  };

  createNotification = (data: NotificationPayload): Promise<BasicResponse> => {
    return apiService.post<BasicResponse>("/notifications-create", data);
  };

  updateNotification = ({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> => {
    return apiService.put<BasicResponse>(
      `/notifications-update?id=${id}`,
      data
    );
  };

  deleteNotificiation = (id: string): Promise<BasicResponse> => {
    return apiService.delete<BasicResponse>(`/notifications-delete?id=${id}`);
  };
}

export const internalResourcesController =
  InterResourcesController.getInstance();
