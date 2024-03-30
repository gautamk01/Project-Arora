"use client";
import { TicketDetails } from "@/lib/type";
import { Agency, Contact, User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

/*************************Type Section **********************/
interface ModalProviderProps {
  children: React.ReactNode;
}
//assigning the Data type of all model
// for user we are using User data type from Prisma Client
export type ModalData = {
  user?: User;
  agency?: Agency;
  contact?: Contact;
  ticket?: TicketDetails[0]; //this is maninly created for the pipeline
};
type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  /**
   * The setOpen function is designed to open a modal or component (the model) and optionally perform
   * some asynchronous task (like fetching data) before doing so.
   * The use of Promise<any> for the fetchData function parameter allows for
   * flexible asynchronous operations,
   */
  setOpen: (model: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};

/*****************************Create Context *********************/
export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (model: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

/**************************** Context Provider******************** */
const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) } || {});
      }
      setShowingModal(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  if (!isMounted) return null;
  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

/*****************USECONTEXT HOOKS**************** */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within the modal provider");
  }
  return context;
};

export default ModalProvider;
