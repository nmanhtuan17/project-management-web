
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { BoardColumn, TaskStatus } from "@/types/task";

interface TaskBoardTitleProps {
  column: BoardColumn;
}

export default function TaskBoardTitle(props: TaskBoardTitleProps) {
  const { column } = props;
  const { openDialog } = useDialogContext();

  return (
    <div className="flex items-center justify-between mb-4 pl-4 pr-[10px]">
      <p className="font-medium text-[14px]">
        {column.title}
      </p>
      {column.id === TaskStatus.PENDING && (
        <Button
          onClick={() => {
            openDialog("createTask");
          }}
          className="w-7 h-7"
          icon={<PlusIcon className="w-4 h-4" />}
          size="icon"
          variant="ghost" />
      )}
    </div>
  )
};
