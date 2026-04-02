import { Activity } from "react";

type ModalProps = {
  open: boolean,
  children: React.ReactNode,
  onClose: () => void;
};

export const Modal = ({ open, children, onClose }: ModalProps) => {
  return (
    <Activity mode={open ? "visible" : "hidden"}>
      <div className="fixed inset-0 z-1000 backdrop-blur-lg bg-black/40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000">
        {children}
      </div>
    </Activity>
  )
}
