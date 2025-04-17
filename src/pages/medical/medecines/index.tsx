import { useEffect, useRef, useState } from "react";
import { Medecine } from "../../../interfaces/MedicalResources";
import {
  ModalAdd,
  ModalConfirmation,
  ModalDetails,
  ModalsHandle,
} from "../../../components/Modals";
import { medicalResourcesController } from "../../../api/medicalResourcesController";
import { BriefcaseMedical, FileUp } from "lucide-react";
import { StatCard } from "../../../components";
import { toast } from "react-toastify";

function MedecinesPage() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [medecines, setMedecines] = useState<Medecine[]>([]);
  const [medecine, setMedecine] = useState<Medecine>();
  const [opsLoading, setOpsLoading] = useState(false);
  const [changes, setChanges] = useState(false);
  const [searchData, setSearchData] = useState<
    Record<string, string | number | boolean>
  >({});
  const [researchReset, setResearchReset] = useState(false);
  const [limitTable, setLimitTable] = useState(10);
  const [dcis, setDcis] = useState<string[]>([]);
  const [regimes, setRegimes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [importFile, setImportFile] = useState<FormData>();
  const detailsModalRef = useRef<ModalsHandle>(null);
  const addModalRef = useRef<ModalsHandle>(null);
  const deleteModalRef = useRef<ModalsHandle>(null);
  const addBulkModalRef = useRef<ModalsHandle>(null);

  const changeResearchReset = () => {
    setResearchReset((prev) => !prev);
    setSearchData({});
  };

  const changeLimitTable = (newLimit: number) => {
    setLimitTable(newLimit);
  };

  const openAddBulkModal = () => {
    addBulkModalRef.current?.open();
  };

  const openDetailsModal = (e: Medecine) => {
    setMedecine(e);
    detailsModalRef.current?.open();
  };
  const openDeleteModal = (e: Medecine) => {
    setMedecine(e);
    deleteModalRef.current?.open();
  };

  const onCloseAddModal = () => {
    addModalRef.current?.close();
  };
  const onCloseAddBulkModal = () => {
    setImportFile(new FormData());
    addBulkModalRef.current?.close();
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };
  const onCloseDeleteModal = () => {
    deleteModalRef.current?.close();
  };

  const getMedecinesAttributes = async () => {
    try {
      const { data } =
        await medicalResourcesController.getMedecinesAttributes();

      setDcis(data.dcis);
      setCategories(data.categories);
      setGroups(data.groups);
      setRegimes(data.regimes);
    } catch (error) {
      console.log(error);
    }
  };

  const getMedecinesCount = async () => {
    try {
      setLoading(true);
      const { data } = await medicalResourcesController.getMedecines({
        queryParams: "limit=100000",
      });

      const size = data.length;

      setCount(size);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getMedecines = async () => {
    try {
      const response = await medicalResourcesController.getMedecines({
        queryParams: `limit=${limitTable}`,
      });

      setMedecines(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMedecinesWithParameters = async () => {
    try {
      const chain = Object.entries(searchData)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const response = await medicalResourcesController.getMedecines({
        queryParams: chain,
      });

      setMedecines(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMedecine = async (id: string) => {
    try {
      setOpsLoading(true);
      const response = await medicalResourcesController.deleteMedecine(id);
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

  const handleAddMedecine = async () => {
    setOpsLoading(true);

    if (!importFile) return;

    try {
      const response = await medicalResourcesController.createMedecine(
        importFile
      );

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

  useEffect(() => {
    getMedecinesCount();
    getMedecinesAttributes();
  }, [changes]);

  useEffect(() => {
    getMedecines();
  }, [limitTable, changes, researchReset]);

  return (
    <article className="flex flex-col m-4">
      <h1 className="text-xl">Statistiques des médicaments assurés</h1>
      <p className="text-light text-xs my-2">
        Les statistiques globales depuis la création
      </p>
      <section className="grid grid-cols-1 my-6 md:grid-cols-2 gap-4">
        <StatCard
          value={count}
          title="Nombre total de médicaments assurés"
          color="red"
          icon={<BriefcaseMedical />}
          isLoading={loading}
          link="/medical-resources/medecines"
        />
      </section>
      <section className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-xl">
            Listing de tous les médicaments assurés de Nuncare{" "}
          </h1>
          <p className="text-light text-xs my-2">
            Retrouvez dans ce tableau tous les médicaments enregistrés sur
            Nuncare
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <button
            className="btn bg-nuncare-green text-white p-3"
            onClick={openAddBulkModal}
          >
            <FileUp /> Importer un lot de médicaments
          </button>
        </div>
      </section>
      <section className="card bg-base-100 shadow p-4 my-4">
        <form key={researchReset.toString()}>
          <select
            defaultValue="Group"
            className="select m-2"
            onChange={(e) => {
              const value = e.target.value;
              setSearchData((prev) => ({
                ...prev,
                group: value,
              }));
            }}
          >
            <option value="">-- Sélectionnez un groupe --</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <select
            defaultValue="DCI"
            className="select m-2"
            onChange={(e) => {
              const value = e.target.value;
              setSearchData((prev) => ({
                ...prev,
                dci: value,
              }));
            }}
          >
            <option value="">-- Sélectionnez une dénomination --</option>
            {dcis.map((dci) => (
              <option key={dci} value={dci}>
                {dci}
              </option>
            ))}
          </select>

          <select
            defaultValue="Category"
            className="select m-2"
            onChange={(e) => {
              const value = e.target.value;
              setSearchData((prev) => ({
                ...prev,
                category: value,
              }));
            }}
          >
            <option value="">-- Sélectionnez une catégorie --</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            defaultValue="Regime"
            className="select m-2"
            onChange={(e) => {
              const value = e.target.value;
              setSearchData((prev) => ({
                ...prev,
                regime: value,
              }));
            }}
          >
            <option value="">-- Sélectionnez un régime --</option>
            {regimes.map((regime) => (
              <option key={regime} value={regime}>
                {regime}
              </option>
            ))}
          </select>
        </form>

        <div className="md:flex flex-row gap-4 my-4">
          <button
            className="btn bg-nuncare-green w-1/5 text-white"
            onClick={getMedecinesWithParameters}
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
        title="Suppression du médicament"
        description={`Voulez vous vraiment supprimer ce médicament : ${medecine?.name} ?`}
        ref={deleteModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleDeleteMedecine(medecine!._id)}
        loading={opsLoading}
      />

      <ModalDetails title="Informations du médicament" ref={detailsModalRef}>
        {medecineDetailsData(medecine!)}
      </ModalDetails>

      <ModalAdd
        ref={addBulkModalRef}
        title="Ajout de médicaments en lot"
        loading={opsLoading}
        description="Importez le fichier (xls) des médicaments à ajouter"
        onConfirm={() => handleAddMedecine()}
        confirmText="Importer le fichier"
        onClose={onCloseAddBulkModal}
      >
        <a
          className="btn btn-soft my-4"
          href="https://res.cloudinary.com/dhc0siki5/raw/upload/v1744823814/nuncare/EXEMPLE_IMPORT_MEDICAMENTS_i6rrsf.xlsx"
          download={true}
        >
          Télécharger le fichier d'exemple
        </a>

        <input
          type="file"
          className="file-input"
          accept=".xls,.xlsx"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            setImportFile(formData);
          }}
        />
      </ModalAdd>

      <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
        {medecines.length > 0 ? (
          <>
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date d'ajout</th>
                  <th>Nom</th>
                  <th>DCI</th>
                  <th>Groupe</th>
                  <th>Regime</th>
                  <th>Catégorie</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medecines.map((medecine) => (
                  <tr key={medecine._id}>
                    <td>
                      {new Date(medecine.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td>{medecine.name}</td>
                    <td>{medecine.dci}</td>
                    <td>{medecine.group}</td>
                    <td>{medecine.regime}</td>
                    <td>{medecine.category}</td>
                    <td>
                      <div className="flex flex-row items-center gap-2 h-full">
                        <button
                          className="btn btn-xs btn-outine btn-soft"
                          onClick={() => {
                            openDetailsModal(medecine);
                          }}
                        >
                          Détails
                        </button>

                        <button
                          className="btn btn-xs bg-red-400 text-white"
                          onClick={() => {
                            openDeleteModal(medecine);
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end my-4">
              <select
                defaultValue="Choisissez la taille du tableau"
                className="select max-w-30"
                onChange={(e) => changeLimitTable(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
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

const medecineDetailsData = (medecine: Medecine) => {
  return (
    <>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Nom </p>
          <p className="font-extralight">{medecine?.name}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Code </p>
          <p className="font-extralight">{medecine?.code}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Groupe </p>
          <p className="font-extralight">{medecine?.group}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">DCI </p>
          <p className="font-extralight">{medecine?.dci}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Catégorie </p>
          <p className="font-extralight">{medecine?.category}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Régime </p>
          <p className="font-extralight">{medecine?.regime}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Prix </p>
          <p className="font-extralight">{medecine?.price}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Date d'ajout </p>
          <p className="font-extralight">
            {new Date(medecine?.createdAt).toLocaleString("fr-FR")}{" "}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Date derniere modification </p>
          <p className="font-extralight">
            {new Date(medecine?.updatedAt).toLocaleString("fr-FR")}{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default MedecinesPage;
