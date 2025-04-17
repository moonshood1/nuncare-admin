import { LandingPageLayout } from "../../../components";
import { locationRoutes } from "../locationRoutes";

function LocationLandingPage() {
  return (
    <LandingPageLayout
      title="Gestion de la localisation"
      description=" Dans cette section , retrouvez les onglets liés à la gestion des villes
        , des régions et des districts"
      routes={locationRoutes}
    />
  );
}

export default LocationLandingPage;
