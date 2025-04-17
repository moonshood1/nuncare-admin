import { useEffect, useRef, useState } from "react";
import { CirclePlus, GraduationCap, SearchIcon } from "lucide-react";
import {
  ModalAdd,
  ModalConfirmation,
  ModalsHandle,
} from "../../../components/Modals";
import { usersController } from "../../../api/usersController";
import { Speciality } from "../../../interfaces/Doctors";
import { toast } from "react-toastify";

function SpecialitiesPage() {
  const [researchReset, setResearchReset] = useState(false);
  const [searchData, setSearchData] = useState<
    Record<string, string | number | boolean>
  >({});
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [opsLoading, setOpsLoading] = useState(false);
  const [changes, setChanges] = useState(false);
  const [speciality, setSpeciality] = useState<Speciality>();
  const [limitTable, setLimitTable] = useState(5);
  const [newSpeciality, setNewSpeciality] = useState("");

  const addModalRef = useRef<ModalsHandle>(null);
  const deleteModalRef = useRef<ModalsHandle>(null);
  const updateModalRef = useRef<ModalsHandle>(null);

  const openDeleteModal = (speciality: Speciality) => {
    setSpeciality(speciality);
    deleteModalRef.current?.open();
  };

  const openAddModalRef = () => {
    addModalRef.current?.open();
  };

  const openUpdateModal = (speciality: Speciality) => {
    setSpeciality(speciality);
    setNewSpeciality(speciality.name);
    updateModalRef.current?.open();
  };

  const onCloseUpdateModal = () => {
    setNewSpeciality("");
    updateModalRef.current?.close();
  };

  const onCloseAddModal = () => {
    setNewSpeciality("");
    addModalRef.current?.close();
  };

  const changeResearchReset = () => {
    setResearchReset((prev) => !prev);
    setSearchData({});
  };

  const changeSpecialitiesTableLimit = (newLimit: number) => {
    setLimitTable(newLimit);
  };

  const getSpecialities = async () => {
    try {
      const response = await usersController.getSpecialities(limitTable);

      setSpecialities(response.data);
    } catch (error) {
      console.log(error);
      toast.error(
        "Une erreur s'est produite lors de la récupération des spécialités"
      );
    }
  };

  const searchSpeciality = async () => {
    try {
      const chain = Object.entries(searchData)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const response = await usersController.getSpecialitiesWithParams({
        queryParams: chain,
      });

      setSpecialities(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateSpeciality = async () => {
    try {
      setOpsLoading(true);
      const response = await usersController.updateSpeciality({
        id: speciality!._id,
        data: {
          name: newSpeciality,
        },
      });

      toast.success(response.message);
      updateModalRef.current?.close();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      deleteModalRef.current?.close();
    } finally {
      setOpsLoading(false);
      setChanges(!changes);
    }
  };

  const handleAddSpeciality = async () => {
    setOpsLoading(true);

    try {
      const response = await usersController.createSpeciality({
        name: newSpeciality,
      });

      toast.success(response.message);
      addModalRef.current?.close();
      setNewSpeciality("");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      addModalRef.current?.close();
      setNewSpeciality("");
    } finally {
      setOpsLoading(false);
      setChanges(!changes);
    }
  };

  const handleDeleteSpeciality = async (id: string) => {
    try {
      setOpsLoading(true);
      const response = await usersController.deleteSpeciality(id);
      toast.success(response.message);

      deleteModalRef.current?.close();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      deleteModalRef.current?.close();
    } finally {
      setChanges(!changes);
      setOpsLoading(false);
    }
  };

  useEffect(() => {
    getSpecialities();
  }, [changes, limitTable, researchReset]);

  return (
    <article>
      <section className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-xl">
            Listing de toutes les spécialités de Nuncare{" "}
          </h1>
          <p className="text-light text-xs my-2">
            Retrouvez dans ce tableau toutes les spécialités enregistrées pour
            les docteurs de Nuncare
          </p>
        </div>
        <div>
          <button
            className="btn bg-nuncare-green text-white p-3"
            onClick={openAddModalRef}
          >
            <CirclePlus /> Ajouter une spécialité
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
                const value = e.target.value;
                setSearchData((prev) => ({
                  ...prev,
                  name: value,
                }));
              }}
            />
          </label>
        </form>

        <div className="md:flex flex-row gap-4 my-4">
          <button
            className="btn bg-nuncare-green w-1/5 text-white"
            onClick={searchSpeciality}
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
        title="Suppression de la spécialité"
        description={`Voulez vous vraiment supprimer cette spécialité : ${speciality?.name} ?`}
        ref={deleteModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleDeleteSpeciality(speciality!._id)}
        loading={opsLoading}
      />

      <ModalAdd
        title="Ajout d'une nouvelle spécialité"
        description="Entrez le nom de la spécialité que vous voulez ajouter"
        ref={addModalRef}
        confirmText="Ajouter"
        onConfirm={() => handleAddSpeciality()}
        loading={opsLoading}
        onClose={onCloseAddModal}
      >
        <label className="input my-2">
          <GraduationCap />
          <input
            type="text"
            value={newSpeciality}
            className="grow"
            placeholder="Urologie"
            onChange={(e) => {
              setNewSpeciality(e.target.value);
            }}
          />
        </label>
      </ModalAdd>

      <ModalAdd
        title={`Modification de la spécialité : ${speciality?.name} `}
        description="Modifiez le nom de la spécialité"
        ref={updateModalRef}
        confirmText="Modifier"
        onConfirm={() => handleUpdateSpeciality()}
        loading={opsLoading}
        onClose={onCloseUpdateModal}
      >
        <label className="input my-2">
          <GraduationCap />
          <input
            type="text"
            value={newSpeciality}
            className="grow"
            placeholder={speciality?.name}
            onChange={(e) => {
              setNewSpeciality(e.target.value);
            }}
          />
        </label>
      </ModalAdd>

      <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
        {specialities.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Date de création</th>
                  <th>Nom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {specialities.map((speciality) => (
                  <tr key={speciality._id}>
                    <td>
                      {new Date(speciality.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td>{speciality.name}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-xs btn-outine btn-soft"
                        onClick={() => {
                          openUpdateModal(speciality);
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-xs bg-red-300"
                        onClick={() => {
                          openDeleteModal(speciality);
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
                onChange={(e) =>
                  changeSpecialitiesTableLimit(Number(e.target.value))
                }
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

export default SpecialitiesPage;
