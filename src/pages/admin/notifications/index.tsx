import { NotificationCard } from "../../../components/NotificationCard";

const notifications = [
  {
    id: 1,
    title: "KYC en attente de traitement",
    content: "Vous avez 3 requetes de demandes KYC encore en attente",
    isRead: false,
  },
  {
    id: 2,
    title: "Articles en attente de validation",
    content: "Vous avez 2 articles en attente de publication",
    isRead: true,
  },
  {
    id: 3,
    title: "Suppression de compte",
    content: "Vous avez 1 demande de suppression de compte en attente",
    isRead: true,
  },
];

function NotificationsPage() {
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      {/* <h1>Vous avez 1 notification(s) non lues </h1> */}

      <section className="mt-4">
        {/* {notifications.map((data) => (
          <NotificationCard
            title={data.title}
            key={data.id}
            content={data.content}
            isRead={data.isRead}
          />
        ))} */}
      </section>
    </div>
  );
}

export default NotificationsPage;
