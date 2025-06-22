import { useEffect, useRef, useState } from "react";
import { Speciality, User } from "../../../interfaces/Doctors";
import {
  ArrowDownIcon,
  SearchIcon,
  SlidersHorizontal,
  UserRoundCheck,
  UserRoundX,
  Users,
} from "lucide-react";
import { StatCard } from "../../../components";
import { usersController } from "../../../api/usersController";
import { locationController } from "../../../api/locationController";
import { City, District, Region } from "../../../interfaces/Location";
import {
  ModalRequest,
  ModalsHandle,
  ModalDetails,
} from "../../../components/Modals";
import { PaginationTab } from "../../../common";

function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [allUsersCount, setAllUsersCount] = useState(0);
  const [kycNokCount, setKycNokCount] = useState(0);
  const [kycOkCount, setKycOkCount] = useState(0);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [page, setPage] = useState(1);
  const [filterTableEnabled, setFilterTableEnabled] = useState(true);
  const [searchData, setSearchData] = useState<
    Record<string, string | number | boolean>
  >({});
  const [numbersOfPage, setNumbersOfPage] = useState(0);
  const [user, setUser] = useState<User>();
  const [researchReset, setResearchReset] = useState(false);
  const userDetailsModalRef = useRef<ModalsHandle>(null);
  const requestModalRef = useRef<ModalsHandle>(null);

  const openUserDetailsModal = (e: User) => {
    setUser(e);
    userDetailsModalRef.current?.open();
  };

  const openRequestModal = (e: User) => {
    setUser(e);
    requestModalRef.current?.open();
  };

  const changeDoctorsTablePage = (newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  const changeTableOrderDisplay = async (newOrder: string) => {
    const sortedUsers = [...doctors].sort((a, b) => {
      if (newOrder === "firstName") {
        return a.firstName.localeCompare(b.firstName);
      } else if (newOrder === "createdAt") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else {
        return 0;
      }
    });

    setDoctors(sortedUsers);
  };

  const changeResearchReset = () => {
    setResearchReset((prev) => !prev);
    setSearchData({});
  };

  const changeFilterTableState = () => {
    setFilterTableEnabled(!filterTableEnabled);
  };

  const getSpecialities = async () => {
    const response = await usersController.getSpecialities(100);
    setSpecialities(response.data);
  };

  const getRegions = async () => {
    const response = await locationController.getRegions({ limit: 100 });
    setRegions(response.data);
  };

  const getCities = async () => {
    const response = await locationController.getCities({ limit: 1000 });
    setCities(response.data);
  };

  const getDistricts = async () => {
    const response = await locationController.getDistricts();
    setDistricts(response.data);
  };

  const getDoctors = async () => {
    try {
      const response = await usersController.getDoctorsPaginated({
        limit: 10,
        page: page,
      });

      setNumbersOfPage(response.meta.totalPages);

      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getKycStatsAndUsersCount = async () => {
    setLoading(true);
    try {
      const [nokRes, okRes, all] = await Promise.all([
        usersController.getDoctorsWithParameters({
          queryParams: "isActive=false",
        }),
        usersController.getDoctorsWithParameters({
          queryParams: "isActive=true",
        }),
        usersController.getDoctors({
          limit: 10000,
        }),
      ]);

      setKycNokCount(nokRes.data.length);
      setKycOkCount(okRes.data.length);
      setAllUsersCount(all.data.length);
    } catch (error) {
      console.error("Erreur lors du chargement des stats KYC :", error);
    } finally {
      setLoading(false);
    }
  };

  const searchDoctorsWithDetails = async () => {
    try {
      const chain = Object.entries(searchData)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const response = await usersController.getDoctorsWithParameters({
        queryParams: chain,
      });

      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deactivateDoctor = async (userId: string) => {
    try {
      const response = await usersController.deleteDoctor(userId);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, [page, researchReset]);

  useEffect(() => {
    getKycStatsAndUsersCount();
    getSpecialities();
    getDistricts();
    getRegions();
    getCities();
  }, []);

  return (
    <div className="flex flex-col m-4">
      <h1 className="text-xl">Statistiques utilisateurs</h1>
      <p className="text-light text-xs my-2">
        Les statistiques globales depuis la création
      </p>
      <section className="grid grid-cols-1 my-6 md:grid-cols-3 gap-4">
        <StatCard
          value={allUsersCount}
          title="Utilisateurs inscrits"
          color="red"
          icon={<Users />}
          isLoading={loading}
          link="#"
        />
        <StatCard
          value={kycOkCount}
          title="Utilisateurs avec KYC"
          color="blue"
          icon={<UserRoundCheck />}
          isLoading={loading}
          link="/doctors/requests-kyc"
        />
        <StatCard
          value={kycNokCount}
          title="Utilisateurs sans KYC"
          color="red"
          icon={<UserRoundX />}
          isLoading={loading}
          link="/doctors/requests-kyc"
        />
      </section>
      <article>
        <section className="flex justify-between">
          <div>
            <h1 className="text-xl">Listing des docteurs </h1>
            <p className="text-light text-xs my-2">
              Retrouvez dans ce tableau tous les docteurs inscrits sur Nuncare
              dans le detail
            </p>
          </div>
          <div>
            <button className="btn" onClick={changeFilterTableState}>
              <SlidersHorizontal />
            </button>
          </div>
        </section>
        {filterTableEnabled ? (
          <section className="card bg-base-100 shadow p-4 my-4">
            <form key={researchReset.toString()}>
              <div className="md:flex flex-row flex-wrap items-center gap-2 my-4">
                <label className="input">
                  <SearchIcon />
                  <input
                    type="search"
                    className="grow"
                    placeholder="Rechercher"
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchData((prev) => ({
                        ...prev,
                        email: value,
                      }));
                    }}
                  />
                </label>

                <select
                  defaultValue="Specialité"
                  className="select my-2"
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      speciality: e.target.value,
                    }))
                  }
                >
                  <option value="">-- Sélectionnez une spécialité --</option>
                  {specialities.map((speciality) => (
                    <option key={speciality._id} value={speciality.name}>
                      {speciality.name}
                    </option>
                  ))}
                </select>
                <select
                  // defaultValue="Université"
                  className="select my-2"
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      university: e.target.value,
                    }))
                  }
                >
                  <option value="">-- Sélectionnez une université --</option>
                  <option value="UFR Sciences Médicales Abidjan">
                    UFR Sciences Médicales Abidjan
                  </option>
                  <option value="UFR Sciences Médicales Bouake">
                    UFR Sciences Médicales Bouake
                  </option>
                  <option value="Autre">Autre</option>
                </select>

                <select
                  defaultValue="District"
                  className="select my-2"
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      district: e.target.value,
                    }))
                  }
                >
                  <option value="">-- Sélectionnez un district --</option>
                  {districts.map((district) => (
                    <option value={district.name} key={district._id}>
                      {district.name}
                    </option>
                  ))}
                </select>

                <select
                  defaultValue="Region"
                  className="select my-2"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchData((prev) => ({
                      ...prev,
                      region: value,
                    }));
                  }}
                >
                  <option value="">-- Sélectionnez une région --</option>
                  {regions.map((region) => (
                    <option key={region._id} value={region.name}>
                      {region.name}
                    </option>
                  ))}
                </select>

                <select
                  defaultValue="Ville"
                  className="select my-2"
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                >
                  <option value="">-- Sélectionnez une ville --</option>
                  {cities.map((city) => (
                    <option value={city.name} key={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            <div className="md:flex flex-row gap-4">
              <button
                className="btn bg-nuncare-green w-1/5 text-white"
                onClick={searchDoctorsWithDetails}
              >
                Filtrer les résultats
              </button>
              <button
                className="btn bg-gray-400 w-1/5"
                onClick={changeResearchReset}
              >
                Réinitialiser la recherche
              </button>
            </div>
          </section>
        ) : null}
        <ModalDetails title="Informations du client" ref={userDetailsModalRef}>
          {userDetailsData(user!)}
        </ModalDetails>
        <ModalRequest
          user={user}
          title="Confirmation de désactivation"
          description="Voulez vous vraiment désactiver le profil du docteur"
          ref={requestModalRef}
          rejectText="Annuler"
          confirmText="Confirmer"
          onConfirm={() => deactivateDoctor(user!._id)}
        />
        <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
          {doctors.length > 0 ? (
            <>
              <div className="flex justify-end">
                <select
                  className="select"
                  onChange={(e) => changeTableOrderDisplay(e.target.value)}
                >
                  <option value={"createdAt"}>
                    Date d'inscription <ArrowDownIcon />{" "}
                  </option>
                  <option value={"firstName"}>
                    Nom complet <ArrowDownIcon />{" "}
                  </option>
                </select>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date d'inscription</th>
                    <th>Nom Complet</th>
                    <th>Specialité</th>
                    <th>Numéro de téléphone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td>
                        {new Date(doctor.createdAt).toLocaleString("fr-FR")}
                      </td>
                      <td>
                        {doctor.firstName} {doctor.lastName}
                      </td>
                      <td>{doctor.speciality}</td>
                      <td>{doctor.phone}</td>
                      <td>{doctor.email}</td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-xs btn-outine btn-soft"
                          onClick={() => {
                            openUserDetailsModal(doctor);
                          }}
                        >
                          Détails
                        </button>
                        {doctor.isActive ? (
                          <button
                            className="btn btn-xs bg-red-400 text-white"
                            onClick={() => openRequestModal(doctor)}
                          >
                            Désactiver
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationTab
                currentPage={page}
                totalPages={numbersOfPage}
                setPage={changeDoctorsTablePage}
              />
              {/* <div className="flex justify-end">
                <select
                  defaultValue="Choisissez la taille du tableau"
                  className="select max-w-30"
                  onChange={(e) =>
                    changeDoctorsTableLimit(Number(e.target.value))
                  }
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                </select>
              </div> */}
            </>
          ) : (
            <p className="font-extralight">Aucun résultat trouvé</p>
          )}
        </section>
      </article>
    </div>
  );
}

const userDetailsData = (user: User) => {
  return (
    <>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm items-center">
          <p className="font-medium">Image du profil </p>
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img alt={`Profile of ${user?._id}`} src={user?.img} />
            </div>
          </div>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Nom complet </p>
          <p className="font-extralight">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Email </p>
          <p className="font-extralight">{user?.email}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Numéro de téléphone </p>
          <p className="font-extralight">{user?.phone}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Spécialité </p>
          <p className="font-extralight">{user?.speciality}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Année d'expérience </p>
          <p className="font-extralight">{user?.years}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Université de formation </p>
          <p className="font-extralight">{user?.university}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Promotion </p>
          <p className="font-extralight">{user?.promotion}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Statut de vérification</p>
          <p className="font-extralight">
            {(() => {
              switch (user?.kycStatus) {
                case "PENDING":
                  return "En attente";
                case "APPROVED":
                  return "Approuvé";
                case "REJECTED":
                  return "Rejeté";
                default:
                  return "Non entamé";
              }
            })()}
          </p>
        </div>
      </div>

      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Région </p>
          <p className="font-extralight">{user?.region}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Ville </p>
          <p className="font-extralight">{user?.city}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Etat compte </p>
          <p className="font-extralight">
            {user?.isActive ? "Actif" : "Inactif"}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Numéro d'ordre </p>
          <p className="font-extralight">{user?.orderNumber}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Hopital d'exercice </p>
          <p className="font-extralight">{user?.hospital}</p>
        </div>
      </div>
    </>
  );
};

export default UsersPage;
