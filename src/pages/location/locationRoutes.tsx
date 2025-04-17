import { Globe, Map } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const locationBaseUrl = "/location";
export const locationRoutes = [
  {
    id: uuidv4(),
    path: `${locationBaseUrl}/regions`,
    title: "Gestion des régions",
    linkTitle: "Voir toutes les regions enregistrées",
    icon: <Globe />,
  },
  {
    id: uuidv4(),
    path: `${locationBaseUrl}/cities`,
    title: "Gestion des villes",
    linkTitle: "Voir toutes les villes enregistrées",
    icon: <Map />,
  },
];
