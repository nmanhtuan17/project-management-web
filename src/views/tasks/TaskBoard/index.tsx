import { cn } from "@/lib/utils.ts";
import { BoardTask } from "@/types/task";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { setBoard } from "@/redux/slices/task.slice.ts";
import { ThemeMode } from "@/enums";
import { ControlledBoard, moveCard } from '@caldwell619/react-kanban';
import '@caldwell619/react-kanban/dist/styles.css';
import apiService from "@/services/api.service.ts";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import useCurrentProject from "@/lib/hooks/useCurrentProject";
import TaskBoardTitle from "@/views/tasks/TaskBoard/TaskBoardTitle";
import { TaskBoardItem } from "@/views/tasks/TaskBoard/TaskBoardItem";

interface TasksBoardProps {
  className?: string;
}

export default function TasksBoard(props: TasksBoardProps) {
  const { className } = props;
  const { board, loading, } = useAppSelector(state => state.task);
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.app);
  const currentProject = useCurrentProject();

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

  return (
    <div className={cn(theme === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT, "flex flex-1 mt-4 -ml-[10px]")}>
      <ControlledBoard
        allowAddCard={false}
        disableColumnDrag
        onCardDragEnd={handleCardMove}
        renderColumnHeader={(column: any) => (
          <div key={column.id}>
            <TaskBoardTitle column={column} />
          </div>
        )}
        renderCard={(task: BoardTask) => (
          <TaskBoardItem key={task._id} task={task} />
        )}
      >
        {board}
      </ControlledBoard>
    </div>
  )
}
