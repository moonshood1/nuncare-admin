import { Hospital, Pill } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const medicalBaseUrl = "/medical-resources";
export const medicalResourcesRoutes = [
  {
    id: uuidv4(),
    path: `${medicalBaseUrl}/pharmacies`,
    title: "Gestion des pharmacies",
    linkTitle: "Voir toutes les pharmacies enregistrées",
    icon: <Hospital />,
  },
  {
    id: uuidv4(),
    path: `${medicalBaseUrl}/medecines`,
    title: "Gestion des médicaments assurés",
    linkTitle: "Voir tous les médicaments enregistrés",
    icon: <Pill />,
  },
];
