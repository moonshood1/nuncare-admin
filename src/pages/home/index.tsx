import { useEffect, useState } from "react";
import {
  Folders,
  GraduationCap,
  Hospital,
  Map,
  Megaphone,
  Newspaper,
  Pill,
  Users,
} from "lucide-react";
import { adminController } from "../../api/adminController";
import { StatCard } from "../../components";
import { v4 as uuidv4 } from "uuid";

function HomePage() {
  const [stats, setStats] = useState<{
    doctors?: number;
    pharmacies?: number;
    articles?: number;
    ads?: number;
    medecines?: number;
    kyc?: number;
    cities?: number;
    specialities?: number;
  }>({});

  const [loading, setLoading] = useState(false);

  const getStats = async () => {
    setLoading(true);
    const response = await adminController.getMainStats();
    setStats(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getStats();
  }, []);

  const statsData = [
    {
      id: uuidv4(),
      number: stats.doctors,
      title: "Nombre de docteurs inscrits",
      color: "red",
      link: "/doctors",
      icon: <Users />,
    },
    {
      id: uuidv4(),
      number: stats.articles,
      title: "Nombre d'articles ecrits",
      color: "blue",
      link: "/internal-resources/articles",
      icon: <Newspaper />,
    },
    {
      id: uuidv4(),
      number: stats.ads,
      title: "Nombre de publicités",
      color: "teal",
      link: "/internal-resources/ads",
      icon: <Megaphone />,
    },
    {
      id: uuidv4(),
      number: stats.pharmacies,
      title: "Nombre de pharmacies",
      color: "green",
      link: "/medical-resources/pharmacies",
      icon: <Hospital />,
    },
    {
      id: uuidv4(),
      number: stats.medecines,
      title: "Nombre de médicaments",
      color: "amber",
      link: "/medical-resources/medecines",
      icon: <Pill />,
    },
    {
      id: uuidv4(),
      number: stats.kyc,
      title: "Nombre de requetes KYC",
      color: "gray",
      link: "/doctors/requests-kyc",
      icon: <Folders />,
    },
    {
      id: uuidv4(),
      number: stats.cities,
      title: "Nombre de villes enregistrées",
      color: "pink",
      link: "/location/cities",
      icon: <Map />,
    },
    {
      id: uuidv4(),
      number: stats.specialities,
      title: "Nombre de spécialités",
      color: "violet",
      link: "/doctors/specialities",
      icon: <GraduationCap />,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Statistiques globales</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {statsData.map((data) => (
          <StatCard
            isLoading={loading}
            value={data.number!}
            key={data.id}
            title={data.title}
            color={data.color}
            link={data.link}
            icon={data.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
