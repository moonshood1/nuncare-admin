import { Building2, CirclePlus, Map, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { City, Region } from "../../../interfaces/Location";
import {
  ModalAdd,
  ModalConfirmation,
  ModalsHandle,
} from "../../../components/Modals";
import { locationController } from "../../../api/locationController";
import { toast } from "react-toastify";

function CitiesPage() {
  const [researchReset, setResearchReset] = useState(false);
  const [opsLoading, setOpsLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City>();
  const [newCity, setNewCity] = useState("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [searchData, setSearchData] = useState("");
  const [limitTable, setLimitTable] = useState(5);
  const [changes, setChanges] = useState(false);
  const [newRegion, setNewRegion] = useState("");

  const addModalRef = useRef<ModalsHandle>(null);
  const updateModalRef = useRef<ModalsHandle>(null);
  const deleteModalRef = useRef<ModalsHandle>(null);

  const openAddModalRef = () => {
    addModalRef.current?.open();
  };
  const openDeleteModalRef = (city: City) => {
    setCity(city);
    deleteModalRef.current?.open();
  };
  const openUpdateModalRef = (city: City) => {
    setCity(city);
    setNewCity(city.name);
    setNewRegion(city.region);
    updateModalRef.current?.open();
  };
  const onCloseUpdateModal = () => {
    setNewCity("");
    updateModalRef.current?.close();
  };
  const onCloseAddModal = () => {
    setNewCity("");
    addModalRef.current?.close();
  };
  const onCloseDeleteModal = () => {
    setNewCity("");
    deleteModalRef.current?.close();
  };

  const searchCity = async () => {
    try {
      const response = await locationController.getCities({
        limit: 10,
        name: searchData,
      });

      setCities(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const changeResearchReset = () => {
    setResearchReset((prev) => !prev);
    setSearchData("");
  };

  const changeCitiesLimitTable = (newLimit: number) => {
    setLimitTable(newLimit);
  };

  const getCities = async () => {
    try {
      const response = await locationController.getCities({
        limit: limitTable,
      });

      setCities(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRegions = async () => {
    try {
      const response = await locationController.getRegions({ limit: 1000 });

      setRegions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterCities = async (e: string) => {
    try {
      const response = await locationController.getCitiesForSelectedRegion(e);

      console.log({ response: response.data });
      setCities(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCity = async () => {
    try {
      setOpsLoading(true);
      const response = await locationController.createCity({
        name: newCity,
        region: newRegion,
      });

      toast.success(response.message);
      onCloseAddModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      onCloseAddModal();
    } finally {
      setOpsLoading(false);
      setChanges(!changes);
    }
  };

  const handleUpdateCity = async () => {
    try {
      setOpsLoading(true);
      const response = await locationController.updateCity({
        id: city!._id,
        data: {
          name: newCity,
          district: newRegion,
        },
      });

      toast.success(response.message);
      onCloseUpdateModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      onCloseUpdateModal();
    } finally {
      setOpsLoading(false);
      setChanges(!changes);
    }
  };

  const handleDeleteCity = async (id: string) => {
    try {
      setOpsLoading(true);
      const response = await locationController.deleteCity(id);
      toast.success(response.message);

      onCloseDeleteModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      onCloseDeleteModal();
    } finally {
      setChanges(!changes);
      setOpsLoading(false);
    }
  };

  useEffect(() => {
    getRegions();
    getCities();
  }, [limitTable, researchReset, changes]);

  return (
    <article>
      <section className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-xl">Listing de toutes les villes de Nuncare </h1>
          <p className="text-light text-xs my-2">
            Retrouvez dans ce tableau toutes les villes enregistrées pour les
            docteurs de Nuncare
          </p>
        </div>
        <div>
          <button
            className="btn bg-nuncare-green text-white p-3"
            onClick={openAddModalRef}
          >
            <CirclePlus /> Ajouter une ville
          </button>
        </div>
      </section>

      <section className="card bg-base-100 shadow p-4 my-4">
        <form key={researchReset.toString()}>
          <label className="input">
            <SearchIcon />
            <input
              type="search"
              className="grow"
              placeholder="Rechercher"
              onChange={(e) => {
                setSearchData(e.target.value);
              }}
            />
          </label>

          <select
            defaultValue="Region"
            className="select m-2"
            onChange={(e) => filterCities(e.target.value)}
          >
            <option value="">-- Sélectionnez une région --</option>
            {regions.map((region) => (
              <option key={region._id} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </form>

        <div className="md:flex flex-row gap-4 my-4">
          <button
            className="btn bg-nuncare-green w-1/5 text-white"
            onClick={searchCity}
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

      <ModalConfirmation
        title="Suppression de la ville"
        description={`Voulez vous vraiment supprimer cette ville : ${city?.name} ?`}
        ref={deleteModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleDeleteCity(city!._id)}
        loading={opsLoading}
      />

      <ModalAdd
        title={`Ajout d'une nouvelle ville`}
        description="Ajoutez les caractéristiques de la ville"
        ref={addModalRef}
        confirmText="Ajouter"
        onConfirm={() => handleAddCity()}
        loading={opsLoading}
        onClose={onCloseAddModal}
      >
        <select
          value={newRegion}
          className="select my-2"
          onChange={(e) => setNewRegion(e.target.value)}
        >
          <option value="">-- Sélectionnez une région --</option>
          {regions.map((region) => (
            <option value={region._id} key={region._id}>
              {region.name}
            </option>
          ))}
        </select>
        <label className="input my-2">
          <Building2 />
          <input
            type="text"
            value={newCity}
            className="grow"
            placeholder="Entrez le nom de la ville"
            onChange={(e) => {
              setNewCity(e.target.value);
            }}
          />
        </label>
      </ModalAdd>

      <ModalAdd
        title={`Modification de la ville : ${city?.name} `}
        description="Modifiez les caractéristiques de la région"
        ref={updateModalRef}
        confirmText="Modifier"
        onConfirm={() => handleUpdateCity()}
        loading={opsLoading}
        onClose={onCloseUpdateModal}
      >
        <label className="input my-2">
          <Map />
          <input
            type="text"
            value={newCity}
            className="grow"
            placeholder={city?.name}
            onChange={(e) => {
              setNewCity(e.target.value);
            }}
          />
        </label>

        <select
          value={newRegion}
          className="select my-2"
          onChange={(e) => setNewRegion(e.target.value)}
        >
          <option value="">-- Sélectionnez une région --</option>
          {regions.map((region) => (
            <option value={region._id} key={region._id}>
              {region.name}
            </option>
          ))}
        </select>
      </ModalAdd>

      <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
        {cities.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Date de création</th>
                  <th>Nom</th>
                  <th>Région</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city._id}>
                    <td>{new Date(city.createdAt).toLocaleString("fr-FR")}</td>
                    <td>{city.name}</td>
                    <td>
                      {regions.find((region) => region._id === city.region)
                        ?.name ?? "Non défini"}
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-xs btn-outine btn-soft"
                        onClick={() => {
                          openUpdateModalRef(city);
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-xs bg-red-300"
                        onClick={() => {
                          openDeleteModalRef(city);
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <select
                defaultValue="Choisissez la taille du tableau"
                className="select max-w-30"
                onChange={(e) => {
                  changeCitiesLimitTable(Number(e.target.value));
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={50}>50</option>
              </select>
            </div>
          </>
        ) : (
          <p className="font-extralight">Aucun résultat trouvé</p>
        )}
      </section>
    </article>
  );
}

export default CitiesPage;
