interface NotificationCardProps {
  readonly title: string;
  readonly content: string;
  readonly isRead: boolean;
}

export function NotificationCard({
  content,
  title,
  isRead,
}: NotificationCardProps) {
  return (
    <div
      className={`card bg-base-100 my-4 px-4 flex flex-row items-center shadow-md cursor-pointer shadow-${
        isRead ? "green" : "red"
      }-100`}
    >
      <div className="card-body flex flex-col flex-2/3">
        <h2 className="text-md font-bold my-3">{title}</h2>
        <h2 className="text-md font-light">{content}</h2>
      </div>
      {!isRead ? (
        <div className="">
          <button className="btn bg-base">Marquer comme lu</button>
        </div>
      ) : null}
    </div>
  );
}
