import { useEffect, useRef, useState } from "react";
import {
  Area,
  Pharmacy,
  PharmacyExport,
  Section,
} from "../../../interfaces/MedicalResources";
import {
  ModalAdd,
  ModalConfirmation,
  ModalDetails,
  ModalsHandle,
} from "../../../components/Modals";
import { medicalResourcesController } from "../../../api/medicalResourcesController";
import { StatCard } from "../../../components";
import { FileDown, FileUp, Hospital, Shield } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LoadingSpinner } from "../../../components/LoadingCircle";

function PharmaciesPage() {
  const [stats, setStats] = useState({
    guard: 0,
    all: 0,
  });
  const [loading, setLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [pharmacy, setPharmacy] = useState<Pharmacy>();
  const [opsLoading, setOpsLoading] = useState(false);
  const [changes, setChanges] = useState(false);
  const [searchData, setSearchData] = useState<
    Record<string, string | number | boolean>
  >({});
  const [researchReset, setResearchReset] = useState(false);
  const [limitTable, setLimitTable] = useState(10);
  const [importFile, setImportFile] = useState<FormData>();
  const [importUpdateFile, setImportUpdateFile] = useState<FormData>();
  const [areas, setAreas] = useState<Area[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [pharmaciesExport, setPharmaciesExport] = useState<PharmacyExport[]>(
    []
  );
  const [exportLoading, setExportLoading] = useState(false);

  const detailsModalRef = useRef<ModalsHandle>(null);
  const deleteModalRef = useRef<ModalsHandle>(null);
  const addBulkModalRef = useRef<ModalsHandle>(null);
  const addGuardBulkModalRef = useRef<ModalsHandle>(null);

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

  const openAddGuardModal = () => {
    addGuardBulkModalRef.current?.open();
  };

  const openDetailsModal = (e: Pharmacy) => {
    setPharmacy(e);
    detailsModalRef.current?.open();
  };
  const openDeleteModal = (e: Pharmacy) => {
    setPharmacy(e);
    deleteModalRef.current?.open();
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

  const onCloseAddGuardBulkModal = () => {
    setImportFile(new FormData());
    addGuardBulkModalRef.current?.close();
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

  const getSections = async () => {
    try {
      const { data } = await medicalResourcesController.getSections();

      setSections(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAreas = async () => {
    try {
      const { data } = await medicalResourcesController.getAreas();

      setAreas(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPharmacies = async () => {
    try {
      const response = await medicalResourcesController.getPharmacies({
        queryParams: `limit=${limitTable}`,
      });

      setPharmacies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPharmaciesWithParameters = async () => {
    try {
      const chain = Object.entries(searchData)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const response = await medicalResourcesController.getPharmacies({
        queryParams: chain,
      });

      setPharmacies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPharmaciesStats = async () => {
    try {
      const [all, guard] = await Promise.all([
        medicalResourcesController.getPharmacies({
          queryParams: "limit=100000",
        }),
        medicalResourcesController.getPharmacies({
          queryParams: "isGuard=true",
        }),
      ]);

      const guardSize = guard.data.length;
      const allSize = all.data.length;

      setStats({
        guard: guardSize,
        all: allSize,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePharmacy = async (id: string) => {
    try {
      setOpsLoading(true);
      const response = await medicalResourcesController.deletePharmacy(id);
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

  const handleAddPharmacy = async () => {
    setOpsLoading(true);

    if (!importFile) return;

    try {
      const response = await medicalResourcesController.createPharmacy(
        importFile
      );

      toast.success(response.message);
      onCloseAddBulkModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      onCloseAddBulkModal();
    } finally {
      setOpsLoading(false);
      setChanges(!changes);
    }
  };

  const handleUpdateGuardPharmacy = async () => {
    setOpsLoading(true);

    if (!importUpdateFile) return;

    try {
      const response = await medicalResourcesController.updateGuardPharmacy(
        importUpdateFile
      );

      toast.success(response.message);
      onCloseAddGuardBulkModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      onCloseAddGuardBulkModal();
    } finally {
      setOpsLoading(false);
      setChanges(!changes);
      onCloseAddGuardBulkModal();
    }
  };

  const handleExportPharmacies = async () => {
    try {
      setExportLoading(true);
      const { data } =
        await medicalResourcesController.getPharmaciesForExport();

      setPharmaciesExport(data);

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Pharmacies");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "pharmacies_export.xlsx");
    } catch (error) {
      console.log(error);
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    getAreas();
    getSections();
    getPharmaciesStats();
  }, [changes]);

  useEffect(() => {
    getPharmacies();
  }, [limitTable, researchReset, changes]);

  return (
    <article className="flex flex-col m-4">
      <h1 className="text-xl">Statistiques des médicaments assurés</h1>
      <p className="text-light text-xs my-2">
        Les statistiques globales depuis la création
      </p>
      <section className="grid grid-cols-1 my-6 md:grid-cols-2 gap-4">
        <StatCard
          value={stats.all}
          title="Nombre total de pharmacies dans la base"
          color="red"
          icon={<Hospital />}
          isLoading={loading}
          link="/medical-resources/pharmacies"
        />
        <StatCard
          value={stats.guard}
          title="Nombre total de pharmacies de garde"
          color="red"
          icon={<Shield />}
          isLoading={loading}
          link="/medical-resources/pharmacies"
        />
      </section>
      <section className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-xl">
            Listing de toutes les pharmacies de Nuncare{" "}
          </h1>
          <p className="text-light text-xs my-2">
            Retrouvez dans ce tableau toutes les pharmacies enregistrées sur
            Nuncare
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <button
            className="btn bg-nuncare-green text-white p-3"
            onClick={openAddBulkModal}
          >
            <FileUp /> Importer un lot de pharmacies
          </button>
          <button
            className="btn bg-nuncare-green text-white p-3"
            onClick={openAddGuardModal}
          >
            <FileUp /> Actualiser les pharmacies de garde
          </button>
        </div>
      </section>
      <section className="card bg-base-100 shadow p-4 my-4">
        <form key={researchReset.toString()}>
          <select
            defaultValue="isGuard"
            className="select m-2"
            onChange={(e) => {
              const value = e.target.value;
              setSearchData((prev) => ({
                ...prev,
                isGuard: value,
              }));
            }}
          >
            <option value="">-- Sélectionnez un statut --</option>

            <option key={1} value={"true"}>
              De garde
            </option>

            <option key={2} value={"false"}>
              Pas de garde
            </option>
          </select>
          <select
            defaultValue=""
            className="select m-2"
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedName =
                sections.find((s) => s._id === selectedId)?.name ?? "";

              setSelectedSectionId(selectedId);
              setSearchData((prev) => ({
                ...prev,
                section: selectedName,
              }));
            }}
          >
            <option value="all">-- Sélectionnez une section --</option>
            {sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.name}
              </option>
            ))}
          </select>

          <select
            defaultValue=""
            className="select m-2"
            onChange={(e) => {
              const selectedName =
                areas.find((a) => a._id === e.target.value)?.name ?? "";

              setSearchData((prev) => ({
                ...prev,
                area: selectedName,
              }));
            }}
          >
            <option value="">-- Sélectionnez une zone --</option>
            {areas
              .filter((area) => area.section === selectedSectionId)
              .map((area) => (
                <option key={area._id} value={area._id}>
                  {area.name}
                </option>
              ))}
          </select>
        </form>

        <div className="md:flex flex-row gap-4 my-4">
          <button
            className="btn bg-nuncare-green w-1/5 text-white"
            onClick={getPharmaciesWithParameters}
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
        title="Suppression de la pharmacie"
        description={`Voulez vous vraiment supprimer cette pharmacie : ${pharmacy?.name} ?`}
        ref={deleteModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleDeletePharmacy(pharmacy!._id)}
        loading={opsLoading}
      />

      <ModalDetails title="Informations de la pharmacie" ref={detailsModalRef}>
        {pharmacyDetailsData(pharmacy!)}
      </ModalDetails>

      <ModalAdd
        ref={addBulkModalRef}
        title="Ajout pharmacies en lot"
        loading={opsLoading}
        description="Importez le fichier (xls) des pharmacies à ajouter"
        onConfirm={() => handleAddPharmacy()}
        confirmText="Importer le fichier"
        onClose={onCloseAddBulkModal}
      >
        <a
          className="btn btn-soft my-4"
          href="https://res.cloudinary.com/dhc0siki5/raw/upload/v1744914275/nuncare/EXEMPLE_IMPORT_PHARMACIES_mtr91c.xlsx"
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

      <ModalAdd
        ref={addGuardBulkModalRef}
        title="Mise a jour des pharmacies de gardes"
        loading={opsLoading}
        description="Importez le fichier (xls) des pharmacies à modifier"
        onConfirm={() => handleUpdateGuardPharmacy()}
        confirmText="Importer le fichier"
        onClose={onCloseAddGuardBulkModal}
      >
        <a
          className="btn btn-soft my-4"
          href="https://res.cloudinary.com/dhc0siki5/raw/upload/v1744914275/nuncare/EXEMPLE_IMPORT_GUARD_PHARMACIES_uplzxg.xlsx"
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

            setImportUpdateFile(formData);
          }}
        />
      </ModalAdd>

      <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
        <div className="flex justify-end">
          {exportLoading ? (
            <LoadingSpinner />
          ) : (
            <button
              className="btn bg-nuncare-green text-white p-3"
              onClick={handleExportPharmacies}
            >
              <FileDown /> Exporter les pharmacies
            </button>
          )}
        </div>
        {pharmacies.length > 0 ? (
          <>
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date d'ajout</th>
                  <th>Nom</th>
                  <th>Section</th>
                  <th>Zone</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pharmacies.map((pharmacy) => (
                  <tr key={pharmacy._id}>
                    <td>
                      {new Date(pharmacy.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td>{pharmacy.name}</td>
                    <td>{pharmacy.section}</td>
                    <td>{pharmacy.area}</td>
                    <td>
                      {(() => {
                        switch (pharmacy?.isGuard) {
                          case true:
                            return (
                              <span className="badge badge-md bg-green-200 rounded-full"></span>
                            );
                          case false:
                            return (
                              <span className="badge badge-md bg-red-200 rounded-full"></span>
                            );
                        }
                      })()}
                    </td>
                    <td>
                      <div className="flex flex-row items-center gap-2 h-full">
                        <button
                          className="btn btn-xs btn-outine btn-soft"
                          onClick={() => {
                            openDetailsModal(pharmacy);
                          }}
                        >
                          Détails
                        </button>
                        {/* 
                        <button
                          className="btn btn-xs bg-amber-200 btn-soft"
                          onClick={() => {
                            openDetailsModal(pharmacy);
                          }}
                        >
                          Modifier
                        </button> */}
                        <button
                          className="btn btn-xs bg-red-400 text-white"
                          onClick={() => {
                            openDeleteModal(pharmacy);
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

const pharmacyDetailsData = (pharmacy: Pharmacy) => {
  return (
    <>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Nom </p>
          <p className="font-extralight">{pharmacy?.name}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Code interne </p>
          <p className="font-extralight">{pharmacy?.code}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Section </p>
          <p className="font-extralight">{pharmacy?.section}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Zone </p>
          <p className="font-extralight">{pharmacy?.area}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Téléphone </p>
          <p className="font-extralight">{pharmacy?.phone}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Pharmacien </p>
          <p className="font-extralight">{pharmacy?.owner}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Adresse </p>
          <p className="font-extralight">{pharmacy?.address}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Statut </p>
          <p className="font-extralight">
            {(() => {
              switch (pharmacy?.isGuard) {
                case true:
                  return (
                    <span className="badge badge-xs bg-green-200 text-xs p-2">
                      De garde
                    </span>
                  );
                case false:
                  return (
                    <span className="badge badge-xs bg-red-200 text-xs p-2">
                      Pas de guarde
                    </span>
                  );
              }
            })()}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Fin de garde </p>
          <p className="font-extralight">
            {new Date(pharmacy?.guardPeriod).toLocaleString("fr-FR")}{" "}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Date d'ajout </p>
          <p className="font-extralight">
            {new Date(pharmacy?.createdAt).toLocaleString("fr-FR")}{" "}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Date derniere modification </p>
          <p className="font-extralight">
            {new Date(pharmacy?.updatedAt).toLocaleString("fr-FR")}{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default PharmaciesPage;
