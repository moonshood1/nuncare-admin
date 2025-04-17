import { LandingPageLayout } from "../../../components";
import { internalResourcesRoutes } from "../resourcesRoutes";

function InternalResourcesLandingPage() {
  return (
    <LandingPageLayout
      title="Gestion des ressources internes"
      description="Dans cette section , retrouvez les onglets liés à la gestion des
        articles , des publicités et des informations"
      routes={internalResourcesRoutes}
    />
  );
}

export default InternalResourcesLandingPage;
