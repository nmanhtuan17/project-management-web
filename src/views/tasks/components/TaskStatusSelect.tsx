import { TaskStatus, TaskTypes } from "@/types/task.ts";
import { MultiSelect, OptionType } from "@/components/ui/multi-select.tsx";
import { createElement, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { taskConfig } from "@/configs/task.config.ts";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";

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

  const options = [{
    label: 'All',
    value: 'all',
  }, {
    label: 'Pending',
    value: TaskStatus.PENDING,
  }, {
    label: 'On Going',
    value: TaskStatus.ON_GOING,
  }, {
    label: 'Rejected',
    value: TaskStatus.REJECTED,
  }, {
    label: 'Completed',
    value: TaskStatus.COMPLETED,
  }].filter(item => props.showAllSelector ? true : item.value !== 'all');

  if (props.multiple) {
    return <MultiSelect
      className={props.className}
      selected={items as string[]}
      options={options}
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
    return <Select value={items as string} onValueChange={selected => {
      setItems(selected);
      props.onChange && props.onChange(selected);
    }}>
      <SelectTrigger className={props.className}>
        <SelectValue placeholder={items as string} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem value={option.value} key={index}>
            <div className={'flex flex-row gap-1'}>
              {props.showIcon && createElement(taskConfig.statuses.find(t => t.value === option.value)?.icon, {
                className: 'w-4 h-4',
              })} {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  }
}
