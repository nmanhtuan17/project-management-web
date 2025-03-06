import { TaskPriority } from "@/types/task.ts";
import { MultiSelect } from "@/components/ui/multi-select.tsx";
import { createElement, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { taskConfig } from "@/configs/task.config.ts";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { useAppSelector } from "@/redux/store";

interface TaskLabelsSelectProps {
  showAllSelector?: boolean;
  onChange?: (labels: string[]) => void;
  showIcon?: boolean;
  className?: string;
  selected?: string[];
}

export function TaskLabelsSelect(props: TaskLabelsSelectProps) {
  const [items, setItems] = useState<string[]>(props.selected);
  const { labels } = useAppSelector(state => state.project)

  const options = labels.map(m => ({
    label: m.title,
    value: m._id
  }))

  useEffect(() => {
    if (props.selected !== items) setItems(props.selected);
  }, [props.selected]);

  return <MultiSelect
    className={props.className}
    selected={items}
    options={options}
    onChange={(selected: string[]) => {
      let filtered = selected;
      if (filtered[filtered.length - 1] === 'all') {
        filtered = ['all'];
      } else if (selected.includes('all')) {
        filtered = filtered.filter(e => e !== 'all')
      }
      setItems(filtered);
      props.onChange && props.onChange(filtered);
    }}
  />
}
