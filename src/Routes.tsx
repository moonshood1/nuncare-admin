import {
  HomePage,
  AccountPage,
  NotificationsPage,
  SettingsPage,
  UsersLandingPage,
  UsersPage,
  SpecialitiesPage,
  KycRequestsPage,
  DeletionRequestsPage,
  LocationLandingPage,
  CitiesPage,
  RegionsPage,
  MedicalResourcesLandingPage,
  MedecinesPage,
  PharmaciesPage,
  InternalResourcesLandingPage,
  AdsPage,
  ArticlesPage,
} from "./pages";

export const appRoutes = [
  { path: "/", element: <HomePage />, id: 1, label: "Accueil" },
  {
    path: "/doctors",
    element: <UsersLandingPage />,
    id: 2,
    label: "Gestion des docteurs",
  },
  {
    path: "/doctors/users-management",
    element: <UsersPage />,
    id: 21,
    label: "Utilisateurs",
  },
  {
    path: "/doctors/requests-kyc",
    element: <KycRequestsPage />,
    id: 22,
    label: "Requetes KYC",
  },
  {
    path: "/doctors/requests-deletion",
    element: <DeletionRequestsPage />,
    id: 23,
    label: "Requetes Suppression",
  },
  {
    path: "/doctors/specialities",
    element: <SpecialitiesPage />,
    id: 24,
    label: "Spécialités",
  },
  {
    path: "/location",
    element: <LocationLandingPage />,
    id: 3,
    label: "Gestion des localisations",
  },
  {
    path: "/location/cities",
    element: <CitiesPage />,
    id: 31,
    label: "Villes",
  },
  {
    path: "/location/regions",
    element: <RegionsPage />,
    id: 32,
    label: "Régions",
  },
  {
    path: "/medical-resources",
    element: <MedicalResourcesLandingPage />,
    id: 4,
    label: "Resources médicales",
  },
  {
    path: "/medical-resources/medecines",
    element: <MedecinesPage />,
    id: 41,
    label: "Médicaments",
  },
  {
    path: "/medical-resources/pharmacies",
    element: <PharmaciesPage />,
    id: 42,
    label: "Pharmacies",
  },
  {
    path: "/internal-resources",
    element: <InternalResourcesLandingPage />,
    id: 5,
    label: "Resources internes",
  },
  {
    path: "/internal-resources/articles",
    element: <ArticlesPage />,
    id: 51,
    label: "Articles",
  },
  {
    path: "/internal-resources/ads",
    element: <AdsPage />,
    id: 52,
    label: "Publicités",
  },
  { path: "/account", element: <AccountPage />, id: 6, label: "Compte" },
  { path: "/settings", element: <SettingsPage />, id: 7, label: "Paramètres" },
  {
    path: "/notifications",
    element: <NotificationsPage />,
    id: 8,
    label: "Notifications",
  },
];
