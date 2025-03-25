import { TaskPriority } from "@/types/task.ts";
import { MultiSelect } from "@/components/ui/multi-select.tsx";
import { createElement, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { taskConfig } from "@/configs/task.config.ts";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { useAppSelector } from "@/redux/store";

interface TaskMilestoneSelectProps {
  showAllSelector?: boolean;
  multiple?: boolean;
  onChange?: (type: string | string[]) => void;
  showIcon?: boolean;
  className?: string;
  selected?: string | string[];
}

export function TaskMilestoneSelect(props: TaskMilestoneSelectProps) {
  const [items, setItems] = useState<string[] | string>(props.selected);
  const { milestones } = useAppSelector(state => state.project)

  const options = milestones.map(m => ({
    label: m.title,
    value: m._id
  }))

  useEffect(() => {
    if (props.selected !== items) setItems(props.selected);
  }, [props.selected]);

  return <Select
    value={items as string}
    onValueChange={selected => {
      setItems(selected);
      props.onChange && props.onChange(selected);
    }}>
    <SelectTrigger className={props.className}>
      <SelectValue placeholder={items as string} />
    </SelectTrigger>
    <SelectContent>
      {!options.length && <p className="text-xs text-muted-foreground p-2">không có dữ liệu</p>}
      {options.map((option, index) => (
        <SelectItem value={option.value} key={index}>
          <div className={'flex flex-row gap-1 items-center'}>
            {option.label}
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
}
