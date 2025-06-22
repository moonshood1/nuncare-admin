import { Bell, Megaphone, Newspaper } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const resourcesBaseUrl = "/internal-resources";
export const internalResourcesRoutes = [
  {
    id: uuidv4(),
    path: `${resourcesBaseUrl}/ads`,
    title: "Gestion des publicités",
    linkTitle: "Voir toutes les publicités créées",
    icon: <Megaphone />,
  },
  {
    id: uuidv4(),
    path: `${resourcesBaseUrl}/notifications`,
    title: "Gestion des notifications",
    linkTitle: "Voir toutes les notifications créées",
    icon: <Bell />,
  },
  {
    id: uuidv4(),
    path: `${resourcesBaseUrl}/articles`,
    title: "Gestion des articles",
    linkTitle: "Voir tous les articles enregistrés",
    icon: <Newspaper />,
  },
];
