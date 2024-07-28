"use client";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface IConfirmPopupContext {
  openConfirmPopup: (cb: () => void) => void;
  closeConfirmPopup: () => void;
  confirmPopup: { isOpen: boolean; cb: () => void };
  confirm: () => void;
}

const ConfirmPopupContext = createContext<IConfirmPopupContext | undefined>(
  undefined
);

export const ConfirmPopupProvider = ({ children }: { children: ReactNode }) => {
  const [confirmPopup, setConfirmPopup] = useState<{
    isOpen: boolean;
    cb: () => void;
  }>({ isOpen: false, cb: () => null });

  const openConfirmPopup = useCallback((cb: () => void) => {
    setConfirmPopup({ isOpen: true, cb });
  }, []);

  const closeConfirmPopup = useCallback(() => {
    setConfirmPopup({ isOpen: false, cb: () => null });
  }, []);

  const confirm = useCallback(() => {
    confirmPopup.cb();
    closeConfirmPopup();
  }, [confirmPopup, closeConfirmPopup]);

  return (
    <ConfirmPopupContext.Provider
      value={{ openConfirmPopup, closeConfirmPopup, confirmPopup, confirm }}
    >
      {children}
    </ConfirmPopupContext.Provider>
  );
};

export const useConfirmPopup = () => {
  const context = useContext(ConfirmPopupContext);
  if (!context) {
    throw new Error(
      "useConfirmPopup must be used within a ConfirmPopupProvider"
    );
  }
  return context;
};
