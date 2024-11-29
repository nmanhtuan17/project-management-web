import { TaskTypes } from "@/types/task.ts";
import { MultiSelect, OptionType } from "@/components/ui/multi-select.tsx";
import { createElement, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { taskConfig } from "@/configs/task.config.ts";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { useTaskStatus } from "@/lib/hooks/useTaskStatus";

interface TaskStatusSelectProps {
  showAllSelector?: boolean;
  multiple?: boolean;
  onChange?: (type: string | string[]) => void;
  showIcon?: boolean;
  className?: string;
  selected?: string | string[];
}

export function TaskStatusSelect(props: TaskStatusSelectProps) {
  const [items, setItems] = useState<string[] | string>(props.selected);
  const { statuses } = useTaskStatus()


  if (props.multiple) {
    return <MultiSelect
      className={props.className}
      selected={items as string[]}
      options={statuses}
      onChange={(selected: string[]) => {
        let filtered: string[] = selected;
        if (filtered[filtered.length - 1] === 'all') {
          // last item is all
          filtered = ['all'];
        } else if (selected.includes('all')) {
          filtered = filtered.filter(e => e !== 'all')
        }
        setItems(filtered);
        props.onChange && props.onChange(filtered);
      }}
    />
  } else {
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
        {statuses.map((option, index) => (
          <SelectItem value={option.value} key={index}>
            <div className={'flex flex-row gap-1 items-center'}>
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  }
}
