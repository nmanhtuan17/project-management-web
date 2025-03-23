import { cn } from "@/lib/utils.ts";
import { BoardTask } from "@/types/task";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { initBoard, setBoard, setTasks } from "@/redux/slices/task.slice.ts";
import { ThemeMode } from "@/enums";
import { ControlledBoard, moveCard } from '@caldwell619/react-kanban';
import '@caldwell619/react-kanban/dist/styles.css';
import apiService from "@/services/api.service.ts";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import TaskBoardTitle from "@/views/tasks/TaskBoard/TaskBoardTitle";
import { TaskBoardItem } from "@/views/tasks/TaskBoard/TaskBoardItem";
import { Button } from "@/components/ui/button";
import { Check, Plus, X } from "lucide-react";
import { createKanbanColumn, loadKanbanBoard, removeColumn, updateColumn } from "@/redux/actions/project.action";
import { loadTasks, updateTask } from "@/redux/actions/task.action";
import { ProjectRoles } from "@/types/project";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";

interface TasksBoardProps {
  className?: string;
}

export default function TasksBoard(props: TasksBoardProps) {
  const { board, loading, tasks } = useAppSelector(state => state.task)
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.app);
  const { currentProject } = useCurrentProject();

  async function handleCardMove(_card: BoardTask, source: any, destination: any) {
    const updatedBoard = moveCard(board, source, destination);

    const updatedTask = {
      ..._card,
      status: destination.toColumnId
    };
    const columnIndexUpdated = updatedBoard.columns.findIndex(item => item.id === destination.toColumnId);
    updatedBoard.columns[columnIndexUpdated].cards = updatedBoard.columns[columnIndexUpdated].cards.map((card: BoardTask) => {
      if (card._id === _card._id) {
        return updatedTask;
      }
      return card;
    });
    dispatch(setBoard({ columns: [...updatedBoard.columns] }));
    const updateTaskRes = await apiService.put(`projects/${currentProject._id}/tasks/${updatedTask._id}`, {
      ...updatedTask,
      labels: updatedTask.labels && updatedTask.labels.map(item => item._id),
      milestone: updatedTask.milestone && updatedTask.milestone._id,
      assignees: updatedTask.assignees.map(i => i._id)
    });
    const task = updateTaskRes.data.task
    dispatch(setTasks({
      tasks: [...tasks.map(t => {
        if (t._id === task._id) {
          return task;
        } else return t;
      })]
    }))
    toast.success(updateTaskRes.message)
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
            renderColumnHeader={(column: any) => <TaskBoardTitle key={column.id} column={column} />}
            renderCard={(task: BoardTask) => <TaskBoardItem key={task._id} task={task} />}>
            {board}
          </ControlledBoard >
        </div >
      }
    </>
  )
}
