import { Activity, useEffect } from "react";

type ModalProps = {
  open: boolean,
  children: React.ReactNode,
  onClose: () => void;
};

export const Modal = ({ open, children, onClose }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  return (
    <Activity mode={open ? "visible" : "hidden"}>
      <div className="fixed inset-0 z-1000 backdrop-blur-2xl bg-black/40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000">
        {children}
      </div>
    </Activity>
  )
}
