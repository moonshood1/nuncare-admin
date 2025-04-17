import { LandingPageLayout } from "../../../components";
import { userRoutes } from "../userRoutes";

function UsersLandingPage() {
  return (
    <LandingPageLayout
      title="Gestion des docteurs"
      description="Dans cette section , retrouvez les onglets liés à la gestion des
        medecins , des spécialités et des requetes"
      routes={userRoutes}
    />
  );
}

export default UsersLandingPage;
