import { LandingPageLayout } from "../../../components";
import { medicalResourcesRoutes } from "../medicalRoutes";

function MedicalResourcesLandingPage() {
  return (
    <LandingPageLayout
      title="Gestion des ressources médicales"
      description="Dans cette section , retrouvez les onglets liés à la gestion des
        médicaments et des pharmacies"
      routes={medicalResourcesRoutes}
    />
  );
}

export default MedicalResourcesLandingPage;
