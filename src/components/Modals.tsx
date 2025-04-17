import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";
import { User } from "../interfaces/Doctors";
import { CircleX } from "lucide-react";
import { LoadingSpinner } from "./LoadingCircle";

export interface ModalsHandle {
  open: () => void;
  close: () => void;
}

interface ModalDetailsProps {
  title: string;
  children: ReactNode;
}

export const ModalDetails = forwardRef<ModalsHandle, ModalDetailsProps>(
  ({ title, children }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open() {
        dialogRef.current?.showModal();
      },
      close() {
        dialogRef.current?.close();
      },
    }));

    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box h-2/3 w-1/2">
          <form action="" method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <CircleX />
            </button>
            <h3 className="font-bold text-lg">{title}</h3>
          </form>
          {children}
        </div>
      </dialog>
    );
  }
);

interface ModalRequestProps {
  title: string;
  user?: User;
  description: string;
  onConfirm?: () => void;
  confirmText?: string;
  onReject?: () => void;
  rejectText?: string;
}

export const ModalRequest = forwardRef<ModalsHandle, ModalRequestProps>(
  (
    { user, title, description, onConfirm, confirmText, onReject, rejectText },
    ref
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open() {
        dialogRef.current?.showModal();
      },
      close() {
        dialogRef.current?.close();
      },
    }));

    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg my-2">{title}</h3>
          <h5 className="font-light text-sm">
            {description} {user?.firstName} {user?.lastName} ?
          </h5>
          <div className="py-4">
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="btn btn-outline"
                onClick={() => {
                  onReject?.();
                  dialogRef.current?.close();
                }}
              >
                {rejectText}
              </button>
              <button
                className="btn bg-red-300"
                onClick={() => {
                  onConfirm?.();
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    );
  }
);

interface ModalConfirmationProps {
  title: string;
  description: string;
  onConfirm?: () => void;
  confirmText?: string;
  rejectText?: string;
  loading: boolean;
}

export const ModalConfirmation = forwardRef<
  ModalsHandle,
  ModalConfirmationProps
>(
  (
    { title, description, onConfirm, confirmText, rejectText, loading },
    ref
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open() {
        dialogRef.current?.showModal();
      },
      close() {
        dialogRef.current?.close();
      },
    }));

    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box flex flex-col text-center items-center">
          <h3 className="font-bold text-lg my-2">{title}</h3>
          <h5 className="font-light text-sm">{description}</h5>
          {loading ? (
            <span className="my-4">
              <LoadingSpinner />
            </span>
          ) : (
            <div className="py-4">
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    dialogRef.current?.close();
                  }}
                >
                  {rejectText}
                </button>
                <button
                  className="btn bg-red-300"
                  onClick={() => {
                    onConfirm?.();
                  }}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    );
  }
);

interface ModalAddProps {
  title: string;
  description: string;
  onConfirm?: () => void;
  confirmText?: string;
  loading: boolean;
  children?: ReactNode;
  onClose?: () => void;
}

export const ModalAdd = forwardRef<ModalsHandle, ModalAddProps>(
  (
    { title, description, onConfirm, confirmText, loading, children, onClose },
    ref
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open() {
        dialogRef.current?.showModal();
      },
      close() {
        dialogRef.current?.close();
      },
    }));

    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box flex flex-col items-center">
          <form action="" method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => onClose?.()}
            >
              <CircleX />
            </button>
          </form>
          <h3 className="font-bold text-lg my-2">{title}</h3>
          <h5 className="font-light text-sm">{description}</h5>
          <section className="flex flex-col items-center my-2">
            {children}
          </section>
          {loading ? (
            <span className="my-4">
              <LoadingSpinner />
            </span>
          ) : (
            <div className="py-1">
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="btn bg-nuncare-green text-white"
                  onClick={() => {
                    onConfirm?.();
                  }}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    );
  }
);
