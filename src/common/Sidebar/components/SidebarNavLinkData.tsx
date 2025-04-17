import { Folder, Hospital, LayoutDashboard, Map, Users } from "lucide-react";
import { v4 as uuidV4 } from "uuid";
export const sidebarNavData = [
  {
    id: uuidV4(),
    label: "Accueil",
    url: "/",
    icon: <LayoutDashboard />,
  },
  {
    id: uuidV4(),
    label: "Gestions des docteurs",
    url: "/doctors",
    icon: <Users />,
  },
  {
    id: uuidV4(),
    label: "Gestions des ressources médicales",
    url: "/medical-resources",
    icon: <Hospital />,
  },
  {
    id: uuidV4(),
    label: "Gestions des localisations",
    url: "/location",
    icon: <Map />,
  },
  {
    id: uuidV4(),
    label: "Gestions des ressources internes",
    url: "/internal-resources",
    icon: <Folder />,
  },
];
