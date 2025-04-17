import { useEffect, useRef, useState } from "react";
import { Verification } from "../../../interfaces/Doctors";
import { usersController } from "../../../api/usersController";
import { StatCard } from "../../../components";
import { Ban, CircleCheckBig, CircleEllipsis } from "lucide-react";
import { ModalConfirmation, ModalsHandle } from "../../../components/Modals";
import { toast } from "react-toastify";

function KycRequestsPage() {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<Verification[]>([]);
  const [researchReset, setResearchReset] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [stats, setStats] = useState({
    ok: 0,
    nok: 0,
    pending: 0,
  });
  const [requestId, setRequestId] = useState("");
  const [opsLoading, setOpsLoading] = useState(false);
  const [changes, setChanges] = useState(false);

  const confirmModalRef = useRef<ModalsHandle>(null);
  const rejectModalRef = useRef<ModalsHandle>(null);

  const kyc_statuses = [
    { id: 1, name: "En attente", value: "PENDING" },
    { id: 2, name: "Approuvées", value: "APPROVED" },
    { id: 3, name: "Rejetées", value: "REJECTED" },
  ];

  const getRequestStats = async () => {
    setLoading(true);
    try {
      const [approved, rejected, pending] = await Promise.all([
        usersController.getKycRequests(1000, "APPROVED"),
        usersController.getKycRequests(1000, "REJECTED"),
        usersController.getKycRequests(1000, "PENDING"),
      ]);

      setStats({
        ok: approved.data.length,
        nok: rejected.data.length,
        pending: pending.data.length,
      });

      const allRequests = approved.data.concat(rejected.data, pending.data);

      setRequests(allRequests);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des stats de requetes KYC :",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getRequestsWithParameters = async () => {
    try {
      const response = await usersController.getKycRequests(
        1000,
        selectedStatus
      );

      setRequests(response.data);
    } catch (error) {
      console.log(
        "Erreur lors de la recupération des requetes apres filtre",
        error
      );
    }
  };

  const handleKycRequest = async (requestId: string, approved: boolean) => {
    try {
      setOpsLoading(true);
      const response = await usersController.updateKycRequest({
        id: requestId,
        data: { validate: approved },
      });

      let modal = approved ? confirmModalRef : rejectModalRef;
      setOpsLoading(false);
      modal.current?.close();
      setChanges(!changes);
      toast.success(response.message);
    } catch (error) {
      console.log(error);
      toast.error("Une erreur s'est produite pendant de l'opération");
    }
  };

  const openConfirmModal = (e: string) => {
    setRequestId(e);
    confirmModalRef.current?.open();
  };

  const openRejectModal = (e: string) => {
    setRequestId(e);
    rejectModalRef.current?.open();
  };

  const changeResearchReset = () => {
    setSelectedStatus("PENDING");
    setResearchReset((prev) => !prev);
  };

  useEffect(() => {
    getRequestStats();
  }, [changes]);

  useEffect(() => {
    getRequestsWithParameters();
  }, [researchReset, changes]);

  return (
    <div className="flex flex-col m-4">
      <h1 className="text-xl">Statistiques de vérification de compte </h1>
      <p className="text-light text-xs my-2">
        Les statistiques globales depuis la création
      </p>
      <section className="grid grid-cols-1 my-6 md:grid-cols-3 gap-4">
        <StatCard
          value={stats.ok}
          title="Requetes validées"
          color="red"
          icon={<CircleCheckBig />}
          isLoading={loading}
          link="/doctors/requests-kyc"
        />
        <StatCard
          value={stats.pending}
          title="Requetes en attente"
          color="blue"
          icon={<CircleEllipsis />}
          isLoading={loading}
          link="/doctors/requests-kyc"
        />
        <StatCard
          value={stats.nok}
          title="Requetes rejetées"
          color="red"
          icon={<Ban />}
          isLoading={loading}
          link="/doctors/requests-kyc"
        />
      </section>
      <article>
        <section className="flex justify-between">
          <div>
            <h1 className="text-xl">Listing des Requetes KYC </h1>
            <p className="text-light text-xs my-2">
              Retrouvez dans ce tableau tous les requetes de vérification de
              compte des docteurs de Nuncare
            </p>
          </div>
        </section>
        <section className="card bg-base-100 shadow p-4 my-4">
          <form key={researchReset.toString()}>
            <div className="md:flex flex-row flex-wrap items-center gap-2 my-4">
              <select
                defaultValue="Specialité"
                className="select my-2"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">-- Sélectionnez un statut --</option>
                {kyc_statuses.map((status) => (
                  <option key={status.id} value={status.value}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <div className="md:flex flex-row gap-4">
            <button
              className="btn bg-nuncare-green w-1/5 text-white"
              onClick={getRequestsWithParameters}
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
          title="Validation de la requete KYC"
          description="Voulez vous vraiment valider le profil du docteur"
          ref={confirmModalRef}
          rejectText="Annuler"
          confirmText="Confirmer"
          onConfirm={() => handleKycRequest(requestId, true)}
          loading={opsLoading}
        />

        <ModalConfirmation
          title="Rejet de la requete KYC"
          description="Voulez vous vraiment rejeter le profil du docteur"
          ref={rejectModalRef}
          rejectText="Annuler"
          confirmText="Confirmer"
          onConfirm={() => handleKycRequest(requestId, false)}
          loading={opsLoading}
        />
        <section className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 my-6 p-4">
          {requests.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date de création</th>
                  <th>Nom</th>
                  <th>Prénoms</th>
                  <th>Type de pièce</th>
                  <th>Numéro de la pièce</th>
                  <th>Image Recto</th>
                  <th>Image Verso</th>
                  <th>Photo</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      {new Date(request.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td>{request.lastName}</td>
                    <td>{request.firstName}</td>
                    <td>{request.documentType}</td>
                    <td>{request.documentNumber}</td>
                    <td>
                      <a
                        href={request.recto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light underline bg-nuncare-green"
                      >
                        Voir
                      </a>
                    </td>
                    <td>
                      {" "}
                      <a
                        href={request.verso}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light underline bg-nuncare-green"
                      >
                        Voir
                      </a>
                    </td>
                    <td>
                      {" "}
                      <a
                        href={request.picture}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light underline bg-nuncare-green"
                      >
                        Voir
                      </a>
                    </td>
                    <td>
                      {" "}
                      {(() => {
                        switch (request.status) {
                          case "PENDING":
                            return "En attente";
                          case "APPROVED":
                            return "Approuvé";
                          case "REJECTED":
                            return "Rejeté";
                        }
                      })()}
                    </td>
                    {request.status != "APPROVED" ? (
                      <td className="flex gap-2">
                        <button
                          className="btn btn-xs btn-outine btn-soft"
                          onClick={() => {
                            openConfirmModal(request._id);
                          }}
                        >
                          Approuver
                        </button>
                        {request.status == "PENDING" && (
                          <button
                            className="btn btn-xs bg-red-400 text-white"
                            onClick={() => {
                              openRejectModal(request._id);
                            }}
                          >
                            Rejeter
                          </button>
                        )}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="font-extralight">Aucun résultat trouvé</p>
          )}
        </section>
      </article>
    </div>
  );
}

export default KycRequestsPage;
