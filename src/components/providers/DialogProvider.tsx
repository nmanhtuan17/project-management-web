import {createContext, ReactNode, useContext, useState} from "react";
import {Outlet} from "react-router-dom";
import { AlertDialogProvider } from "./AlertDialogProvider";
import { CreateProjectDialog } from "@/views/project/components/CreateProjectDialog";

interface DialogContextType {
  createProject: {
    open: boolean;
  }
  
  openDialog?: (dialog: Omit<keyof DialogContextType, 'openDialog'>, data?: any) => void,
  closeDialog?: (dialog: Omit<keyof DialogContextType, 'openDialog'>) => void,
  setDialogOpen?: (dialog: Omit<keyof DialogContextType, 'openDialog'>, open: boolean, data?: any) => void,
}

const DialogContext = createContext<DialogContextType>({
  createProject: {
    open: false
  }
});

interface DialogProviderProps {
}

export const useDialogContext = () => useContext(DialogContext);

export default function DialogProvider(props: DialogProviderProps) {
  const [dialogs, setDialogs] = useState<DialogContextType>({
    createProject: {
      open: false
    }
  });

  const setDialogOpen = (dialog: keyof DialogContextType, open: boolean, data?: any) => {
    setDialogs({
      ...dialogs,
      [dialog]: {
        ...dialogs[dialog],
        ...data,
        open,
      }
    });
  }

  const openDialog = (dialog: keyof DialogContextType, data?: any) => setDialogOpen(dialog, true, data);
  const closeDialog = (dialog: keyof DialogContextType) => setDialogOpen(dialog, false);

  return <AlertDialogProvider>
    <DialogContext.Provider value={{
      ...dialogs,
      openDialog,
      closeDialog,
      setDialogOpen,
    }}>
      <Outlet/>  
      <CreateProjectDialog />    
    </DialogContext.Provider>
  </AlertDialogProvider>
}
