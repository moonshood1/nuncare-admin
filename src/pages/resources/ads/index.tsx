import {
  Building2,
  CirclePlus,
  Link,
  Megaphone,
  MegaphoneOff,
  Text,
} from "lucide-react";
import { StatCard } from "../../../components";
import { useEffect, useRef, useState } from "react";
import { Ad } from "../../../interfaces/InternalResources";
import { internalResourcesController } from "../../../api/internalResourcesController";
import {
  ModalAdd,
  ModalConfirmation,
  ModalDetails,
  ModalsHandle,
} from "../../../components/Modals";
import { toast } from "react-toastify";
import { tiersApiController } from "../../../api/tiersApiController";

function AdsPage() {
  const [stats, setStats] = useState({
    ok: 0,
    nok: 0,
    all: 0,
  });
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);
  const [ad, setAd] = useState<Ad>();
  const [opsLoading, setOpsLoading] = useState(false);
  const [changes, setChanges] = useState(false);
  const [searchData, setSearchData] = useState<
    Record<string, string | number | boolean>
  >({});
  const [newAd, setNewAd] = useState<{
    label: string;
    company: string;
    description: string;
    websiteLink: string;
    img: File | null;
  }>({
    label: "",
    company: "",
    description: "",
    websiteLink: "",
    img: null,
  });

  const [researchReset, setResearchReset] = useState(false);
  const [limitTable, setLimitTable] = useState(5);
  const detailsModalRef = useRef<ModalsHandle>(null);
  const addModalRef = useRef<ModalsHandle>(null);
  const deleteModalRef = useRef<ModalsHandle>(null);
  const activateModalRef = useRef<ModalsHandle>(null);
  const deactivateModalRef = useRef<ModalsHandle>(null);

  const statuses = [
    {
      id: 0,
      label: "Toutes les publicités",
      value: "",
    },
    {
      id: 1,
      label: "Publicités inactives",
      value: "false",
    },
    {
      id: 2,
      label: "Publicités actives",
      value: "true",
    },
  ];

  const changeResearchReset = () => {
    setResearchReset((prev) => !prev);
    setSearchData({});
  };

  const changeAdsLimitTable = (newLimit: number) => {
    setLimitTable(newLimit);
  };

  const openAdDetailsModal = (e: Ad) => {
    setAd(e);
    detailsModalRef.current?.open();
  };

  const openDeactivateModal = (e: Ad) => {
    setAd(e);
    deactivateModalRef.current?.open();
  };

  const openActivateModal = (e: Ad) => {
    setAd(e);
    activateModalRef.current?.open();
  };

  const openAdDeleteModal = (e: Ad) => {
    setAd(e);
    deleteModalRef.current?.open();
  };

  const openAddModalRef = () => {
    addModalRef.current?.open();
  };
  const onCloseAddModal = () => {
    addModalRef.current?.close();
  };

  const onCloseDeactivateModal = () => {
    deactivateModalRef.current?.close();
  };

  const onCloseActivateModal = () => {
    activateModalRef.current?.close();
  };

  const onCloseDeleteModal = () => {
    deleteModalRef.current?.close();
  };

  const handleActivateAd = async () => {
    try {
      setOpsLoading(true);
      const response = await internalResourcesController.updateAd({
        id: ad!._id,
        data: {
          isActive: true,
        },
      });

      toast.success(response.message);
      onCloseActivateModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      onCloseActivateModal();
    } finally {
      setOpsLoading(false);
      setChanges(!changes);
    }
  };
  const handleDeactivateAd = async () => {
    try {
      setOpsLoading(true);
      const response = await internalResourcesController.updateAd({
        id: ad!._id,
        data: {
          isActive: false,
        },
      });

      toast.success(response.message);
      onCloseDeactivateModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      onCloseDeactivateModal();
    } finally {
      setOpsLoading(false);
      setChanges(!changes);
    }
  };

  const handleDeleteAd = async (id: string) => {
    try {
      setOpsLoading(true);
      const response = await internalResourcesController.deleteAd(id);
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

  const handleCreateAd = async () => {
    try {
      setOpsLoading(true);

      if (!newAd.img) return;

      const urlImg = await tiersApiController.uploadToCloudinary(newAd.img);

      if (urlImg) {
        const response = await internalResourcesController.createAd({
          label: newAd.label,
          description: newAd.description,
          websiteLink: newAd.websiteLink,
          company: newAd.company,
          img: urlImg,
        });

        if (response.success) {
          toast.success(response.message);
          onCloseAddModal();
        }
      }
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

  const getAds = async () => {
    try {
      const response = await internalResourcesController.getAds({
        queryParams: `limit=${limitTable}`,
      });

      setAds(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAdsStats = async () => {
    setLoading(true);
    try {
      const [active, inactive] = await Promise.all([
        internalResourcesController.getAds({ queryParams: "isActive=true" }),
        internalResourcesController.getAds({ queryParams: "isActive=false" }),
      ]);

      const allCount = inactive.data.length + active.data.length;

      setStats({
        ok: active.data.length,
        nok: inactive.data.length,
        all: allCount,
      });
    } catch (error) {
      console.error(
        "Erreur lors du chargement des stats des publicités :",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getAdsWithParameters = async () => {
    try {
      const chain = Object.entries(searchData)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const response = await internalResourcesController.getAds({
        queryParams: chain,
      });

      setAds(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdsStats();
  }, [changes]);

  useEffect(() => {
    getAds();
  }, [limitTable, changes, researchReset]);

  return (
    <article className="flex flex-col m-4">
      <h1 className="text-xl">Statistiques des publicités</h1>
      <p className="text-light text-xs my-2">
        Les statistiques globales depuis la création
      </p>
      <section className="grid grid-cols-1 my-6 md:grid-cols-3 gap-4">
        <StatCard
          value={stats.all}
          title="Toutes les publicités créées"
          color="red"
          icon={<Megaphone />}
          isLoading={loading}
          link="/internal-resources/ads"
        />
        <StatCard
          value={stats.ok}
          title="Publicités actives"
          color="blue"
          icon={<Megaphone />}
          isLoading={loading}
          link="/internal-resources/ads"
        />
        <StatCard
          value={stats.nok}
          title="Publicités inactives"
          color="red"
          icon={<MegaphoneOff />}
          isLoading={loading}
          link="/internal-resources/ads"
        />
      </section>
      <section className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-xl">
            Listing de toutes les publicités de Nuncare{" "}
          </h1>
          <p className="text-light text-xs my-2">
            Retrouvez dans ce tableau toutes les publicités enregistrées sur
            Nuncare
          </p>
        </div>
        <div>
          <button
            className="btn bg-nuncare-green text-white p-3"
            onClick={openAddModalRef}
          >
            <CirclePlus /> Ajouter une publicité
          </button>
        </div>
      </section>
      <section className="card bg-base-100 shadow p-4 my-4">
        <form key={researchReset.toString()}>
          <select
            defaultValue="Region"
            className="select m-2"
            onChange={(e) => {
              const value = e.target.value;
              setSearchData((prev) => ({
                ...prev,
                isActive: value,
              }));
            }}
          >
            <option value="">-- Sélectionnez un statut --</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </form>

        <div className="md:flex flex-row gap-4 my-4">
          <button
            className="btn bg-nuncare-green w-1/5 text-white"
            onClick={getAdsWithParameters}
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
        title="Suppression de la Publicité"
        description={`Voulez vous vraiment supprimer cette publicité : ${ad?.label} ?`}
        ref={deleteModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleDeleteAd(ad!._id)}
        loading={opsLoading}
      />

      <ModalConfirmation
        title="Désactivation de la Publicité"
        description={`Voulez vous vraiment désactiver cette publicité : ${ad?.label} ?`}
        ref={deactivateModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleDeactivateAd()}
        loading={opsLoading}
      />

      <ModalConfirmation
        title="Activation de la Publicité"
        description={`Voulez vous vraiment activer cette publicité : ${ad?.label} ?`}
        ref={activateModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleActivateAd()}
        loading={opsLoading}
      />

      <ModalAdd
        ref={addModalRef}
        title="Ajout d'une publicité"
        loading={opsLoading}
        description="Ajoutez une nouvelle publicité à Nuncare"
        onConfirm={() => handleCreateAd()}
        confirmText="Créer la publicité"
      >
        <label className="input my-2">
          <Text />
          <input
            type="text"
            value={newAd?.label}
            className="grow"
            placeholder="Entrez le titre de la publicité"
            onChange={(e) => {
              const value = e.target.value;
              setNewAd((prev) => ({
                ...prev,
                label: value,
              }));
            }}
          />
        </label>

        <input
          type="file"
          className="file-input"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setNewAd((prev) => ({
              ...prev,
              img: file,
            }));
          }}
        />

        <label className="input my-2">
          <Text />
          <input
            type="text"
            value={newAd?.description}
            className="grow"
            placeholder="Entrez la description de la publicité"
            onChange={(e) => {
              const value = e.target.value;
              setNewAd((prev) => ({
                ...prev,
                description: value,
              }));
            }}
          />
        </label>
        <label className="input my-2">
          <Link />
          <input
            type="text"
            value={newAd?.websiteLink}
            className="grow"
            placeholder="Entrez le lien de la publicité"
            onChange={(e) => {
              const value = e.target.value;
              setNewAd((prev) => ({
                ...prev,
                websiteLink: value,
              }));
            }}
          />
        </label>
        <label className="input my-2">
          <Building2 />
          <input
            type="text"
            value={newAd?.company}
            className="grow"
            placeholder="Entrez la compagnie de la publicité"
            onChange={(e) => {
              const value = e.target.value;
              setNewAd((prev) => ({
                ...prev,
                company: value,
              }));
            }}
          />
        </label>
      </ModalAdd>

      <ModalDetails title="Détails de la publicité" ref={detailsModalRef}>
        {adDetailsData(ad!)}
      </ModalDetails>
      <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
        {ads.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Date d'inscription</th>
                  <th>Titre</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Société</th>
                  <th>Etat</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad._id}>
                    <td>{new Date(ad.createdAt).toLocaleString("fr-FR")}</td>
                    <td>{ad.label}</td>
                    <td>
                      <div className="w-10 h-5 rounded-full">
                        <img alt={`Pub Ad ${ad?._id}`} src={ad?.img} />
                      </div>
                    </td>
                    <td>{ad.description}</td>
                    <td>{ad.company}</td>
                    <td>
                      {(() => {
                        switch (ad.isActive) {
                          case true:
                            return (
                              <span className="badge badge-xs bg-green-200 text-xs p-2">
                                Active
                              </span>
                            );
                          case false:
                            return (
                              <span className="badge badge-xs bg-red-200 text-xs p-2">
                                Inactive
                              </span>
                            );
                        }
                      })()}
                    </td>
                    <td className="flex flex-row items-center gap-2">
                      <button
                        className="btn btn-xs btn-outine btn-soft"
                        onClick={() => {
                          openAdDetailsModal(ad);
                        }}
                      >
                        Détails
                      </button>
                      {ad.isActive ? (
                        <button
                          className="btn btn-xs bg-amber-300 btn-soft"
                          onClick={() => {
                            openDeactivateModal(ad);
                          }}
                        >
                          Désactiver
                        </button>
                      ) : (
                        <button
                          className="btn btn-xs bg-green-300 btn-soft"
                          onClick={() => {
                            openActivateModal(ad);
                          }}
                        >
                          Activer
                        </button>
                      )}

                      <button
                        className="btn btn-xs bg-red-400 text-white"
                        onClick={() => {
                          openAdDeleteModal(ad);
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end my-4">
              <select
                defaultValue="Choisissez la taille du tableau"
                className="select max-w-30"
                onChange={(e) => changeAdsLimitTable(Number(e.target.value))}
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

const adDetailsData = (ad: Ad) => {
  return (
    <section className="flex flex-col p-4">
      <div className="my-4">
        <img src={ad?.img} alt={`Ad ${ad?._id}`} className="w-full" />
      </div>

      <h1 className="text-xl font-medium py-0.5">{ad?.label}</h1>
      <p className="text-sm font-extralight py-0.5">{ad?.description}</p>

      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Statut </p>
          <p className="font-extralight">
            {(() => {
              switch (ad?.isActive) {
                case true:
                  return (
                    <span className="badge badge-xs bg-green-200 text-xs p-2">
                      Active
                    </span>
                  );
                case false:
                  return (
                    <span className="badge badge-xs bg-red-200 text-xs p-2">
                      Inactive
                    </span>
                  );
              }
            })()}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Entreprise </p>
          <p className="font-extralight">{ad?.company}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Lien site web </p>
          <p className="font-extralight">{ad?.websiteLink}</p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium"> Date de création </p>
          <p className="font-extralight">
            {new Date(ad?.createdAt).toLocaleString("fr-FR")}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium"> Date de Modification </p>
          <p className="font-extralight">
            {new Date(ad?.updatedAt).toLocaleString("fr-FR")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdsPage;
