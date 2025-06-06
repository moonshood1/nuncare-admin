import { CirclePlus, GlobeIcon, Map, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { District, Region } from "../../../interfaces/Location";
import {
  ModalAdd,
  ModalConfirmation,
  ModalsHandle,
} from "../../../components/Modals";
import { locationController } from "../../../api/locationController";
import { toast } from "react-toastify";

function DistrictsPage() {
  const [researchReset, setResearchReset] = useState(false);
  const [opsLoading, setOpsLoading] = useState(false);
  const [district, setDistrict] = useState<District>();
  const [newDistrict, setNewDistrict] = useState("");
  const [districts, setDistricts] = useState<District[]>([]);
  const [changes, setChanges] = useState(false);

  const addModalRef = useRef<ModalsHandle>(null);
  const updateModalRef = useRef<ModalsHandle>(null);
  const deleteModalRef = useRef<ModalsHandle>(null);

  const openAddModalRef = () => {
    addModalRef.current?.open();
  };
  const openUpdateModalRef = (district: District) => {
    setDistrict(district);
    setNewDistrict(district.name);
    updateModalRef.current?.open();
  };
  const onCloseUpdateModal = () => {
    setNewDistrict("");
    updateModalRef.current?.close();
  };
  const onCloseAddModal = () => {
    setNewDistrict("");
    addModalRef.current?.close();
  };
  const onCloseDeleteModal = () => {
    setNewDistrict("");
    deleteModalRef.current?.close();
  };

  const getDistricts = async () => {
    try {
      const response = await locationController.getDistricts();

      setDistricts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDistrict = async () => {
    try {
      setOpsLoading(true);
      const response = await locationController.createDistrict({
        name: newDistrict,
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

  const handleUpdateDistrict = async () => {
    try {
      setOpsLoading(true);
      const response = await locationController.updateDistrict({
        id: district!._id,
        data: {
          name: newDistrict,
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

  const handleDeleteDistrict = async (id: string) => {
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
    getDistricts();
  }, [researchReset, changes]);

  return (
    <article>
      <section className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-xl">Listing de tous les districts de Nuncare </h1>
          <p className="text-light text-xs my-2">
            Retrouvez dans ce tableau tous les districts enregistrés pour les
            docteurs de Nuncare
          </p>
        </div>
        <div>
          <button
            className="btn bg-nuncare-green text-white p-3"
            onClick={openAddModalRef}
          >
            <CirclePlus /> Ajouter un district
          </button>
        </div>
      </section>

      <ModalConfirmation
        title="Suppression du district"
        description={`Voulez vous vraiment supprimer ce district : ${district?.name} ?`}
        ref={deleteModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleDeleteDistrict(district!._id)}
        loading={opsLoading}
      />

      <ModalAdd
        title={`Ajout d'un nouveau district`}
        description="Ajoutez le nom du nouveau du district"
        ref={addModalRef}
        confirmText="Ajouter"
        onConfirm={() => handleAddDistrict()}
        loading={opsLoading}
        onClose={onCloseAddModal}
      >
        <label className="input my-2">
          <GlobeIcon />
          <input
            type="text"
            value={newDistrict}
            className="grow"
            placeholder="Entrez le nom du district"
            onChange={(e) => {
              setNewDistrict(e.target.value);
            }}
          />
        </label>
      </ModalAdd>

      <ModalAdd
        title={`Modification du district : ${district?.name} `}
        description="Modifiez les caractéristiques du district"
        ref={updateModalRef}
        confirmText="Modifier"
        onConfirm={() => handleUpdateDistrict()}
        loading={opsLoading}
        onClose={onCloseUpdateModal}
      >
        <label className="input my-2">
          <GlobeIcon />
          <input
            type="text"
            value={newDistrict}
            className="grow"
            placeholder={district?.name}
            onChange={(e) => {
              setNewDistrict(e.target.value);
            }}
          />
        </label>
      </ModalAdd>

      <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
        {districts.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Date de création</th>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((district) => (
                <tr key={district._id}>
                  <td>
                    {new Date(district.createdAt).toLocaleString("fr-FR")}
                  </td>
                  <td>{district.name}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-xs btn-outine btn-soft"
                      onClick={() => {
                        openUpdateModalRef(district);
                      }}
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="font-extralight">Aucun résultat trouvé</p>
        )}
      </section>
    </article>
  );
}

export default DistrictsPage;
