import { useEffect, useRef, useState } from "react";
import { StatCard } from "../../../components";
import {
  ModalConfirmation,
  ModalDetails,
  ModalsHandle,
} from "../../../components/Modals";
import { Article } from "../../../interfaces/InternalResources";
import { internalResourcesController } from "../../../api/internalResourcesController";
import { toast } from "react-toastify";
import { FolderCheck, Folders, FolderX } from "lucide-react";
import { usersController } from "../../../api/usersController";
import { User } from "../../../interfaces/Doctors";

function ArticlesPage() {
  const [searchData, setSearchData] = useState<
    Record<string, string | number | boolean>
  >({});
  const [researchReset, setResearchReset] = useState(false);
  const [limitTable, setLimitTable] = useState(5);
  const [loading, setLoading] = useState(false);
  const [opsLoading, setOpsLoading] = useState(false);
  const [changes, setChanges] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [article, setArticle] = useState<Article>();
  const [stats, setStats] = useState({
    ok: 0,
    nok: 0,
    all: 0,
  });
  const [authors, setAuthors] = useState<User[]>([]);

  const detailsModalRef = useRef<ModalsHandle>(null);
  const activateModalRef = useRef<ModalsHandle>(null);
  const deactivateModalRef = useRef<ModalsHandle>(null);
  const deleteModalRef = useRef<ModalsHandle>(null);

  const statuses = [
    {
      id: 0,
      label: "Tous les articles",
      value: "",
    },
    {
      id: 1,
      label: "Articles inactifs",
      value: "false",
    },
    {
      id: 2,
      label: "Articles actifs",
      value: "true",
    },
  ];
  const changeArticlesLimitTable = (newLimit: number) => {
    setLimitTable(newLimit);
  };

  const openArticleDetailsModal = (e: Article) => {
    setArticle(e);
    detailsModalRef.current?.open();
  };

  const openArticleDeleteModal = (e: Article) => {
    setArticle(e);
    deleteModalRef.current?.open();
  };

  const openArticleActivateModal = (e: Article) => {
    setArticle(e);
    activateModalRef.current?.open();
  };
  const openArticleDeactivateModal = (e: Article) => {
    setArticle(e);
    deactivateModalRef.current?.open();
  };

  const onCloseArticleDeleteModal = () => {
    deleteModalRef.current?.close();
  };

  const onCloseArticleActivateModal = () => {
    activateModalRef.current?.close();
  };
  const onCloseArticleDeactivateModal = () => {
    deactivateModalRef.current?.close();
  };

  const changeResearchReset = () => {
    setResearchReset((prev) => !prev);
    setSearchData({});
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      setOpsLoading(true);
      const response = await internalResourcesController.deleteArticle(id);
      toast.success(response.message);

      onCloseArticleDeleteModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      onCloseArticleDeleteModal();
    } finally {
      setChanges(!changes);
      setOpsLoading(false);
    }
  };

  const handleActivateArticle = async () => {
    try {
      setOpsLoading(true);
      const response = await internalResourcesController.updateArticle({
        id: article!._id,
        data: {
          isActive: true,
        },
      });

      toast.success(response.message);
      onCloseArticleActivateModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      onCloseArticleActivateModal();
    } finally {
      setOpsLoading(false);
      setChanges(!changes);
    }
  };
  const handleDeactivateArticle = async () => {
    try {
      setOpsLoading(true);
      const response = await internalResourcesController.updateArticle({
        id: article!._id,
        data: {
          isActive: false,
        },
      });

      toast.success(response.message);
      onCloseArticleDeactivateModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";

      toast.error(errorMessage);
      onCloseArticleDeactivateModal();
    } finally {
      setOpsLoading(false);
      setChanges(!changes);
    }
  };

  const getArticles = async () => {
    try {
      const response = await internalResourcesController.getArticles({
        queryParams: `limit=${limitTable}`,
      });

      setArticles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getArticlesStats = async () => {
    setLoading(true);
    try {
      const [active, inactive] = await Promise.all([
        internalResourcesController.getArticles({
          queryParams: "isActive=true",
        }),
        internalResourcesController.getArticles({
          queryParams: "isActive=false",
        }),
      ]);

      const allCount = inactive.data.length + active.data.length;

      setStats({
        ok: active.data.length,
        nok: inactive.data.length,
        all: allCount,
      });
    } catch (error) {
      console.error(
        "Erreur lors du chargement des stats des articles :",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getArticlesWithParameters = async () => {
    try {
      const chain = Object.entries(searchData)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const response = await internalResourcesController.getArticles({
        queryParams: chain,
      });

      setArticles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAuthors = async () => {
    const response = await usersController.getDoctors({ limit: 2000 });
    setAuthors(response.data);
  };

  useEffect(() => {
    getArticlesStats();
    getAuthors();
  }, [changes]);

  useEffect(() => {
    getArticles();
  }, [limitTable, changes]);

  return (
    <article className="flex flex-col m-4">
      <h1 className="text-xl">Statistiques des articles</h1>
      <p className="text-light text-xs my-2">
        Les statistiques globales depuis la création
      </p>
      <section className="grid grid-cols-1 my-6 md:grid-cols-3 gap-4">
        <StatCard
          value={stats.all}
          title="Tous les articles"
          color="red"
          icon={<Folders />}
          isLoading={loading}
          link="/internal-resources/articles"
        />
        <StatCard
          value={stats.ok}
          title="Articles actifs"
          color="blue"
          icon={<FolderCheck />}
          isLoading={loading}
          link="/internal-resources/articles"
        />
        <StatCard
          value={stats.nok}
          title="Articles inactifs"
          color="red"
          icon={<FolderX />}
          isLoading={loading}
          link="/internal-resources/articles"
        />
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
            onClick={getArticlesWithParameters}
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
        title="Suppression de l'article"
        description={`Voulez vous vraiment supprimer cet article : ${article?.title} ?`}
        ref={deleteModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleDeleteArticle(article!._id)}
        loading={opsLoading}
      />

      <ModalConfirmation
        title="Désactivation de l'article"
        description={`Voulez vous vraiment désactiver cet article : ${article?.title} ?`}
        ref={deactivateModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleDeactivateArticle()}
        loading={opsLoading}
      />

      <ModalConfirmation
        title="Activation de l'article"
        description={`Voulez vous vraiment activer cet article : ${article?.title} ?`}
        ref={activateModalRef}
        rejectText="Annuler"
        confirmText="Confirmer"
        onConfirm={() => handleActivateArticle()}
        loading={opsLoading}
      />

      <ModalDetails title="Détails de l'article" ref={detailsModalRef}>
        {articleDetailsData(article!)}
      </ModalDetails>

      <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
        {articles.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Date d'inscription</th>
                  <th>Titre</th>
                  <th>Type</th>
                  <th>Illustration</th>
                  <th>Description</th>
                  <th>Contenu</th>
                  <th>Auteur</th>
                  <th>Etat</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td>
                      {new Date(article.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td>{article.title}</td>
                    <td>
                      {(() => {
                        switch (article.type) {
                          case "img":
                            return (
                              <span className="badge badge-xs bg-blue-700 text-xs p-3 text-white">
                                Image
                              </span>
                            );
                          case "video":
                            return (
                              <span className="badge badge-xs bg-cyan-200 text-xs p-3 text-white">
                                Video
                              </span>
                            );
                        }
                      })()}
                    </td>
                    <td>
                      <div className="w-20 h-10 rounded-full">
                        <img
                          alt={`Article ${article?._id}`}
                          src={article?.img}
                        />
                      </div>
                    </td>
                    <td>
                      <p className="line-clamp-2 overflow-ellipsis">
                        {article.description}
                      </p>
                    </td>
                    <td>
                      <p className="line-clamp-3 overflow-ellipsis">
                        {article.content}
                      </p>
                    </td>
                    <td>
                      {authors.find((author) => author._id === article.author)
                        ?.firstName ?? "Non défini"}
                    </td>
                    <td>
                      {(() => {
                        switch (article.isActive) {
                          case true:
                            return (
                              <span className="badge badge-xs bg-green-200 text-xs p-2">
                                Actif
                              </span>
                            );
                          case false:
                            return (
                              <span className="badge badge-xs bg-red-200 text-xs p-2">
                                Inactif
                              </span>
                            );
                        }
                      })()}
                    </td>
                    <td>
                      <div className="flex flex-row items-center gap-2 h-full">
                        <button
                          className="btn btn-xs btn-outine btn-soft"
                          onClick={() => {
                            openArticleDetailsModal(article);
                          }}
                        >
                          Détails
                        </button>
                        {article.isActive ? (
                          <button
                            className="btn btn-xs bg-amber-300 btn-soft"
                            onClick={() => {
                              openArticleDeactivateModal(article);
                            }}
                          >
                            Désactiver
                          </button>
                        ) : (
                          <button
                            className="btn btn-xs bg-green-300 btn-soft"
                            onClick={() => {
                              openArticleActivateModal(article);
                            }}
                          >
                            Activer
                          </button>
                        )}

                        <button
                          className="btn btn-xs bg-red-400 text-white"
                          onClick={() => {
                            openArticleDeleteModal(article);
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
            <div className="flex justify-end">
              <select
                defaultValue="Choisissez la taille du tableau"
                className="select max-w-30"
                onChange={(e) =>
                  changeArticlesLimitTable(Number(e.target.value))
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

const articleDetailsData = (article: Article) => {
  return (
    <section className="flex flex-col p-4">
      <div className="my-4">
        {article?.type == "video" ? (
          <img
            src={article?.coverImage}
            className="w-full"
            alt={`Article ${article?._id}`}
          />
        ) : (
          <img
            src={article?.img}
            alt={`Article ${article?._id}`}
            className="w-full"
          />
        )}
      </div>

      <h1 className="text-xl font-medium py-0.5">{article?.title}</h1>
      <p className="text-sm font-light py-0.5">{article?.description}</p>
      <p className="text-sm font-extralight py-0.5">{article?.content}</p>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Statut </p>
          <p className="font-extralight">
            {(() => {
              switch (article?.isActive) {
                case true:
                  return (
                    <span className="badge badge-xs bg-green-200 text-xs p-2">
                      Actif
                    </span>
                  );
                case false:
                  return (
                    <span className="badge badge-xs bg-red-200 text-xs p-2">
                      Inactif
                    </span>
                  );
              }
            })()}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium">Publié ? </p>
          <p className="font-extralight">
            {article?.isPublished ? "Oui" : "Non"}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium"> Date de création </p>
          <p className="font-extralight">
            {new Date(article?.createdAt).toLocaleString("fr-FR")}
          </p>
        </div>
      </div>
      <div className="py-4">
        <div className="md:flex flex-row justify-between text-sm">
          <p className="font-medium"> Date de Modification </p>
          <p className="font-extralight">
            {new Date(article?.updatedAt).toLocaleString("fr-FR")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ArticlesPage;
