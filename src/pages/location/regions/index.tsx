import { CirclePlus, Map, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { District, Region } from "../../../interfaces/Location";
import {
  ModalAdd,
  ModalConfirmation,
  ModalsHandle,
} from "../../../components/Modals";
import { locationController } from "../../../api/locationController";
import { toast } from "react-toastify";

function RegionsPage() {
  const [researchReset, setResearchReset] = useState(false);
  const [opsLoading, setOpsLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [region, setRegion] = useState<Region>();
  const [newRegion, setNewRegion] = useState("");
  const [districts, setDistricts] = useState<District[]>([]);
  const [searchData, setSearchData] = useState("");
  const [limitTable, setLimitTable] = useState(5);
  const [changes, setChanges] = useState(false);
  const [newDistrict, setNewDistrict] = useState("");

  const addModalRef = useRef<ModalsHandle>(null);
  const updateModalRef = useRef<ModalsHandle>(null);
  const deleteModalRef = useRef<ModalsHandle>(null);

  const openAddModalRef = () => {
    addModalRef.current?.open();
  };
  const openDeleteModalRef = (region: Region) => {
    setRegion(region);
    deleteModalRef.current?.open();
  };
  const openUpdateModalRef = (region: Region) => {
    setRegion(region);
    setNewRegion(region.name);
    setNewDistrict(region.district);
    updateModalRef.current?.open();
  };
  const onCloseUpdateModal = () => {
    setNewRegion("");
    updateModalRef.current?.close();
  };
  const onCloseAddModal = () => {
    setNewRegion("");
    addModalRef.current?.close();
  };
  const onCloseDeleteModal = () => {
    setNewRegion("");
    deleteModalRef.current?.close();
  };

  const searchRegion = async () => {
    try {
      const response = await locationController.getRegions({
        limit: 10,
        name: searchData,
      });

      setRegions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const changeResearchReset = () => {
    setResearchReset((prev) => !prev);
    setSearchData("");
  };

  const changeRegionsTableLimit = (newLimit: number) => {
    setLimitTable(newLimit);
  };

  const getRegions = async () => {
    try {
      const response = await locationController.getRegions({
        limit: limitTable,
      });

      setRegions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDistricts = async () => {
    try {
      const response = await locationController.getDistricts();

      setDistricts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddRegion = async () => {
    try {
      setOpsLoading(true);
      const response = await locationController.createRegion({
        name: newRegion,
        district: newDistrict,
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

  const handleUpdateRegion = async () => {
    try {
      setOpsLoading(true);
      const response = await locationController.updateRegion({
        id: region!._id,
        data: {
          name: newRegion,
          district: newDistrict,
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

  const handleDeleteRegion = async (id: string) => {
    try {
      setOpsLoading(true);
      const response = await locationController.deleteRegion(id);
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
    getDistricts();
  }, [limitTable, researchReset, changes]);

  return (
    <article>
      <section className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-xl">Listing de toutes les régions de Nuncare </h1>
          <p className="text-light text-xs my-2">
            Retrouvez dans ce tableau toutes les régions enregistrées pour les
            docteurs de Nuncare
          </p>
        </div>
        <div>
          <button
            className="btn bg-nuncare-green text-white p-3"
            onClick={openAddModalRef}
          >
            <CirclePlus /> Ajouter une région
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
        </form>

        <div className="md:flex flex-row gap-4 my-4">
          <button
            className="btn bg-nuncare-green w-1/5 text-white"
            onClick={searchRegion}
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
        title="Suppression de la région"
        description={`Voulez vous vraiment supprimer cette région : ${region?.name} ?`}
        ref={deleteModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleDeleteRegion(region!._id)}
        loading={opsLoading}
      />

      <ModalAdd
        title={`Ajout d'une nouvelle région`}
        description="Ajoutez les caractéristiques de la région"
        ref={addModalRef}
        confirmText="Ajouter"
        onConfirm={() => handleAddRegion()}
        loading={opsLoading}
        onClose={onCloseAddModal}
      >
        <select
          value={newDistrict}
          className="select my-2"
          onChange={(e) => setNewDistrict(e.target.value)}
        >
          <option value="">-- Sélectionnez un district --</option>
          {districts.map((district) => (
            <option value={district._id} key={district._id}>
              {district.name}
            </option>
          ))}
        </select>
        <label className="input my-2">
          <Map />
          <input
            type="text"
            value={newRegion}
            className="grow"
            placeholder="Entrez le nom de la région"
            onChange={(e) => {
              setNewRegion(e.target.value);
            }}
          />
        </label>
      </ModalAdd>

      <ModalAdd
        title={`Modification de la région : ${region?.name} `}
        description="Modifiez les caractéristiques de la région"
        ref={updateModalRef}
        confirmText="Modifier"
        onConfirm={() => handleUpdateRegion()}
        loading={opsLoading}
        onClose={onCloseUpdateModal}
      >
        <label className="input my-2">
          <Map />
          <input
            type="text"
            value={newRegion}
            className="grow"
            placeholder={region?.name}
            onChange={(e) => {
              setNewRegion(e.target.value);
            }}
          />
        </label>

        <select
          value={newDistrict}
          className="select my-2"
          onChange={(e) => setNewDistrict(e.target.value)}
        >
          <option value="">-- Sélectionnez un district --</option>
          {districts.map((district) => (
            <option value={district._id} key={district._id}>
              {district.name}
            </option>
          ))}
        </select>
      </ModalAdd>

      <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
        {regions.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Date de création</th>
                  <th>Nom</th>
                  <th>District</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((region) => (
                  <tr key={region._id}>
                    <td>
                      {new Date(region.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td>{region.name}</td>
                    <td>
                      <td>
                        {districts.find(
                          (district) => district._id === region.district
                        )?.name ?? "Non défini"}
                      </td>
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-xs btn-outine btn-soft"
                        onClick={() => {
                          openUpdateModalRef(region);
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-xs bg-red-300"
                        onClick={() => {
                          openDeleteModalRef(region);
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
                  changeRegionsTableLimit(Number(e.target.value));
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

export default RegionsPage;
