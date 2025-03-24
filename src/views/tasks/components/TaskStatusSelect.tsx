import { TaskTypes } from "@/types/task.ts";
import { MultiSelect, OptionType } from "@/components/ui/multi-select.tsx";
import { createElement, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { taskConfig } from "@/configs/task.config.ts";

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
  }, ...taskConfig.statuses
  ].filter(item => props.showAllSelector ? true : item.value !== 'all');

  useEffect(() => {
    if (props.selected !== items) setItems(props.selected);
  }, [props.selected]);

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
        {taskConfig.statuses.map((option, index) => (
          <SelectItem value={option.value} key={index}>
            <div className={'flex flex-row gap-1 items-center'}>
              {props.showIcon && <option.icon className={'w-4 h-4'} />} {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  }
}
