import { Ban, Folders, GraduationCap, Users } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const usersBaseUrl = "/doctors";
export const userRoutes = [
  {
    id: uuidv4(),
    path: `${usersBaseUrl}/users-management`,
    title: "Gestion des docteurs",
    linkTitle: "Voir tous les docteurs",
    icon: <Users />,
  },
  {
    id: uuidv4(),
    path: `${usersBaseUrl}/requests-kyc`,
    title: "Les requetes KYC",
    linkTitle: "Voir toutes les demandes KYC",
    icon: <Folders />,
  },
  {
    id: uuidv4(),
    path: `${usersBaseUrl}/specialities`,
    title: "Les spécialités",
    linkTitle: "Voir toutes les spécialités",
    icon: <GraduationCap />,
  },
  {
    id: uuidv4(),
    path: `${usersBaseUrl}/requests-deletion`,
    title: "Les requetes de suppression",
    linkTitle: "Voir toutes les requetes de suppression",
    icon: <Ban />,
  },
];
