import { useEffect, useRef, useState } from "react";
import {
  ModalAdd,
  ModalConfirmation,
  ModalsHandle,
} from "../../../components/Modals";
import { PaginationTab } from "../../../common";
import { CirclePlus, Text } from "lucide-react";
import { toast } from "react-toastify";
import { internalResourcesController } from "../../../api/internalResourcesController";
import { Notification } from "../../../interfaces/InternalResources";
import { tiersApiController } from "../../../api/tiersApiController";
import { LoadingSpinner } from "../../../components/LoadingCircle";

function NotificationsManagementPage() {
  const [loading, setLoading] = useState(true);
  const [opsLoading, setOpsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [numbersOfPage, setNumbersOfPage] = useState(0);
  const [notification, setNotification] = useState<Notification>();
  const [newNotification, setNewNotification] = useState<{
    title: string;
    message: string;
    type: string;
    users: string[];
    img: File | null;
  }>({
    title: "",
    message: "",
    type: "",
    img: null,
    users: [],
  });
  const [changes, setChanges] = useState(false);
  const addModalRef = useRef<ModalsHandle>(null);
  const deleteModalRef = useRef<ModalsHandle>(null);

  const openAdDeleteModal = (e: Notification) => {
    setNotification(e);
    deleteModalRef.current?.open();
  };

  const closeRequestModal = () => {
    deleteModalRef.current?.close();
  };

  const openAddModalRef = () => {
    addModalRef.current?.open();
  };

  const onCloseAddModal = () => {
    setNewNotification({
      title: "",
      message: "",
      type: "",
      img: null,
      users: [],
    });
    addModalRef.current?.close();
  };

  const changeDoctorsTablePage = (newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  const getNotifications = async () => {
    try {
      setLoading(true);

      const response = await internalResourcesController.getNotifications({
        limit: 10,
        page: page,
      });

      setNumbersOfPage(response.meta.totalPages);

      setNotifications(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      setOpsLoading(true);
      const response = await internalResourcesController.deleteNotificiation(
        id
      );

      if (response.success) {
        toast.success(response.message);
        closeRequestModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateNotification = async () => {
    try {
      setOpsLoading(true);
      if (!newNotification.img) return;
      const urlImg = await tiersApiController.uploadToCloudinary(
        newNotification.img
      );
      if (urlImg) {
        const response = await internalResourcesController.createNotification({
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          users: newNotification.users,
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

  useEffect(() => {
    getNotifications();
  }, [page, changes]);

  return (
    <div className="flex flex-col m-4">
      <article>
        <section className="flex justify-between">
          <div>
            <h1 className="text-xl">Listing des notifications </h1>
            <p className="text-light text-xs my-2">
              Retrouvez dans ce tableau toutes les notifications enregistrées
              sur Nuncare dans le detail
            </p>
          </div>
          <div>
            <button
              className="btn bg-nuncare-green text-white p-3"
              onClick={openAddModalRef}
            >
              <CirclePlus /> Ajouter une notification
            </button>
          </div>
        </section>

        <ModalConfirmation
          title="Suppression de la notification"
          description={`Voulez vous vraiment supprimer cette notification : ${notification?.title} ?`}
          ref={deleteModalRef}
          rejectText="Annuler"
          confirmText="Confirmer"
          onConfirm={() => handleDeleteNotification(notification!._id)}
          loading={opsLoading}
        />

        <ModalAdd
          ref={addModalRef}
          title="Ajout d'une notification"
          loading={opsLoading}
          description="Envoyez une nouvelle notification aux utilisateurs de Nuncare"
          onConfirm={() => handleCreateNotification()}
          confirmText="Envoyer la notification"
          onClose={onCloseAddModal}
        >
          <label className="input my-2">
            <Text />
            <input
              type="text"
              value={newNotification?.title}
              className="grow"
              placeholder="Entrez le titre de la notification"
              onChange={(e) => {
                const value = e.target.value;
                setNewNotification((prev) => ({
                  ...prev,
                  title: value,
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
              setNewNotification((prev) => ({
                ...prev,
                img: file,
              }));
            }}
          />

          <select
            value={newNotification?.type}
            className="select my-2"
            onChange={(e) => {
              const value = e.target.value;
              setNewNotification((prev) => ({
                ...prev,
                type: value,
              }));
            }}
          >
            <option value="">-- Sélectionnez un type de notification --</option>

            <option value={"ALL"} key={"ALL"}>
              Tous les utilisateurs
            </option>
            <option value={"CRITERIA"} key={"CRITERIA"}>
              Une cible spécifique
            </option>
          </select>

          <label className="input my-2">
            <Text />
            <input
              type="text"
              value={newNotification?.message}
              className="grow"
              placeholder="Entrez le message de la notification"
              onChange={(e) => {
                const value = e.target.value;
                setNewNotification((prev) => ({
                  ...prev,
                  message: value,
                }));
              }}
            />
          </label>
        </ModalAdd>

        <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
          {notifications.length > 0 ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date de création</th>
                    <th>Titre</th>
                    <th>Message</th>
                    <th>Type</th>
                    <th>Image</th>
                    <th>Lien</th>
                    <th>Cible</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification._id}>
                      <td>
                        {new Date(notification.createdAt).toLocaleString(
                          "fr-FR"
                        )}
                      </td>
                      <td>{notification.title}</td>
                      <td>{notification.message}</td>
                      <td>{notification.type}</td>
                      <td>
                        <div className="max-w-10">
                          <img
                            alt={`Notification ${notification?._id}`}
                            src={notification?.img}
                          />
                        </div>
                      </td>
                      <td>
                        <a href={notification.link} target="_blank">
                          {" "}
                          {notification.link}
                        </a>
                      </td>
                      <td>{notification.users.length}</td>
                      <td className="flex flex-row items-center gap-2">
                        <button
                          className="btn btn-xs bg-red-400 text-white"
                          onClick={() => {
                            openAdDeleteModal(notification);
                          }}
                        >
                          Supprimer
                        </button>
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
            </>
          ) : loading ? (
            <div className="flex text-center justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : (
            <p className="font-extralight">Aucun résultat trouvé</p>
          )}
        </section>
      </article>
    </div>
  );
}

export default NotificationsManagementPage;
