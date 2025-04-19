import { createContext, ReactNode, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AlertDialogProvider } from "./AlertDialogProvider";
import { CreateProjectDialog } from "@/components/dialogs/CreateProjectDialog";
import { CreateTaskDialog } from "@/views/tasks/dialogs/CreateTaskDialog";
import { TaskDetailDialog } from "@/views/tasks/components/TaskDetailDialog";
import { InviteMemberDialog } from "@/views/member/dialogs/InviteMemberDialog";
import { CreateLabelDialog } from "@/components/dialogs/CreateLabelDialog";
import { CreateMilestoneDialog } from "../dialogs/CreateMilestoneDialog";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { UploadFileDialog } from "../dialogs/UploadFileDialog";
// import { TaskDetail } from "@/views/tasks/TaskDetail";

interface DialogContextType {
  createProject: {
    open: boolean;
  }
  createTaskDialog: {
    open: boolean;
    parentTask?: string;
  }

  taskDetail: {
    open: boolean,
    element?: ReactNode
  },
  inviteMember: {
    open: boolean
  }
  createLabelDialog: {
    open: boolean
  }

  createMilestone: {
    open: boolean
  }
  confirmDialog: {
    open: boolean,
    element?: ReactNode
  },
  uploadFileDialog: {
    open: boolean
  }
  createTaskDetailElemennt?: (element: ReactNode) => void,
  openDialog?: (dialog: Omit<keyof DialogContextType, 'openDialog'>, data?: any) => void,
  closeDialog?: (dialog: Omit<keyof DialogContextType, 'openDialog'>) => void,
  setDialogOpen?: (dialog: Omit<keyof DialogContextType, 'openDialog'>, open: boolean, data?: any) => void,
}

const DialogContext = createContext<DialogContextType>({
  createProject: {
    open: false
  },
  createTaskDialog: {
    open: false
  },
  taskDetail: {
    open: false
  },
  inviteMember: {
    open: false
  },
  createLabelDialog: {
    open: false
  },
  createMilestone: {
    open: false
  },
  confirmDialog: {
    open: false
  },
  uploadFileDialog: {
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
    },
    createTaskDialog: {
      open: false
    },
    taskDetail: {
      open: false
    },
    inviteMember: {
      open: false
    },
    createLabelDialog: {
      open: false
    },
    createMilestone: {
      open: false
    },
    confirmDialog: {
      open: false
    },
    uploadFileDialog: {
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
      <Outlet />
      <CreateProjectDialog />
      <CreateTaskDialog />
      <TaskDetailDialog >
        {dialogs.taskDetail.element}
      </TaskDetailDialog>
      <InviteMemberDialog />
      <CreateLabelDialog />
      <CreateMilestoneDialog />
      <ConfirmDialog>
        {dialogs.confirmDialog.element}
      </ConfirmDialog>
      <UploadFileDialog />
    </DialogContext.Provider>
  </AlertDialogProvider>
}
