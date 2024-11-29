import { cn } from "@/lib/utils.ts";
import { BoardTask } from "@/types/task";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { initBoard, setBoard } from "@/redux/slices/task.slice.ts";
import { ThemeMode } from "@/enums";
import { ControlledBoard, moveCard } from '@caldwell619/react-kanban';
import '@caldwell619/react-kanban/dist/styles.css';
import apiService from "@/services/api.service.ts";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import useCurrentProject from "@/lib/hooks/useCurrentProject";
import TaskBoardTitle from "@/views/tasks/TaskBoard/TaskBoardTitle";
import { TaskBoardItem } from "@/views/tasks/TaskBoard/TaskBoardItem";
import { Button } from "@/components/ui/button";
import { Check, Plus, X } from "lucide-react";
import { createKanbanColumn, loadKanbanBoard, removeColumn, updateColumn } from "@/redux/actions/project.action";
import { loadTasks } from "@/redux/actions/task.action";
import { ProjectRoles } from "@/types/project";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface TasksBoardProps {
  className?: string;
}

export default function TasksBoard(props: TasksBoardProps) {
  const { board, loading, tasks } = useAppSelector(state => state.task)
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.app);
  const currentProject = useCurrentProject();
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState<string>('')

  async function handleCardMove(_card: BoardTask, source: any, destination: any) {
    // const updatedBoard = moveCard(board, source, destination);
    // const updatedTask = {
    //   ..._card,
    //   status: destination.toColumnId
    // };
    // const columnIndexUpdated = updatedBoard.columns.findIndex(item => item.id === destination.toColumnId);
    // updatedBoard.columns[columnIndexUpdated].cards = updatedBoard.columns[columnIndexUpdated].cards.map((card: BoardTask) => {
    //   if (card._id === _card._id) {
    //     return updatedTask;
    //   }
    //   return card;
    // });
    // dispatch(setBoard({columns: [...updatedBoard.columns]}));
    // await apiService.updateTask(space._id, updatedTask);
  }

  const updateColumnTitle = async (columnId: string, title: string) => {
    if (currentProject.profile.role === ProjectRoles.OWNER || currentProject.profile.role === ProjectRoles.MANAGER) {
      dispatch(updateColumn({
        projectId: currentProject._id,
        columnId,
        title
      })).then(() => {
        dispatch(loadKanbanBoard(currentProject._id))
          .then(() => {
            dispatch(loadTasks(currentProject._id))
          })
      })
    } else {

      toast.error('ACTION NOT PERMITTED')
    }
  }

  const handleRemoveColumn = async (columnId: string) => {
    if (currentProject.profile.role === ProjectRoles.OWNER || currentProject.profile.role === ProjectRoles.MANAGER) {
      dispatch(removeColumn({
        projectId: currentProject._id,
        columnId
      })).then(() => {
        dispatch(loadKanbanBoard(currentProject._id))
          .then(() => {
            dispatch(loadTasks(currentProject._id))
          })
      })
    } else {
      toast.error('ACTION NOT PERMITTED')
    }
  }

  return (
    <>
      {loading ? (<div>
        <LoadingSpinner />
      </div>) :
        <div className={cn(theme === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT, "flex flex-1 mt-4 -ml-[10px]")}>
          <ControlledBoard
            allowAddCard={false}
            allowAddColumn={true}
            disableColumnDrag
            onCardDragEnd={handleCardMove}
            renderColumnHeader={(column: any) => (
              <div key={column.id}>
                <TaskBoardTitle column={column} handleUpdateTitle={updateColumnTitle} handleRemoveColumn={handleRemoveColumn} />
              </div>
            )}
            renderColumnAdder={() => {
              return (
                <div>
                  {!visible ?
                    <TooltipProvider delayDuration={500}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            onClick={() => {
                              setVisible(true)

                            }}
                            variant="secondary" className="m-[5px] justify-center items-center gap-1">
                            <Plus size={18} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side={'right'}>
                          <p>New Column</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider >
                    :
                    <div className="w-[200px] gap-1 items-center">
                      <Input
                        className="outline-none focus:outline-[0px] mt-1"
                        onChange={(e) => {
                          setTitle(e.target.value)
                        }}
                        value={title} />
                      <div className="flex !flex-row mt-2">
                        <span
                          onClick={() => {
                            if (title.length > 0) {
                              dispatch(createKanbanColumn({ projectId: currentProject._id, title }))
                                .then(() => {
                                  setVisible(false)
                                  setTitle('')
                                  dispatch(loadKanbanBoard(currentProject._id))
                                    .then(() => {
                                      dispatch(loadTasks(currentProject._id))
                                    })
                                })
                            }
                          }}
                          className="p-2 bg-white rounded-sm cursor-pointer shadow-sm">
                          <Check size={16} />
                        </span>
                        <span
                          onClick={() => setVisible(false)}
                          className="p-2 bg-white rounded-sm cursor-pointer">
                          <X size={16} />
                        </span>

                      </div>
                    </div>
                  }
                </div>
              )
            }}
            renderCard={(task: BoardTask) => (
              <TaskBoardItem key={task._id} task={task} />
            )}
          >
            {board}
          </ControlledBoard >
        </div >
      }
    </>
  )
}
