import { MultiSelect } from "@/components/ui/multi-select.tsx";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { Task } from "@/types/task";
import { CircleAlert } from "lucide-react";

interface TaskSelectProps {
  selected?: string[];
  onChange?: (tasks: string[]) => void;
  className?: string;
  excludeTaskId?: string;
}

export function TaskSelect(props: TaskSelectProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>(props.selected || []);
  const { tasks } = useAppSelector(state => state.task);

  const options = tasks
    .filter(task => task._id !== props.excludeTaskId) // Exclude current task from selection
    .map(task => ({
      label: (
        <div className="flex items-center gap-2">
          <CircleAlert size={16} />
          {task.title}
        </div>
      ),
      value: task._id
    }));

  useEffect(() => {
    if (props.selected !== selectedTasks) {
      setSelectedTasks(props.selected || []);
    }
  }, [props.selected]);

  return (
    <MultiSelect
      className={props.className}
      selected={selectedTasks}
      options={options}
      onChange={(selected: string[]) => {
        setSelectedTasks(selected);
        props.onChange && props.onChange(selected);
      }}
    />
  );
} 