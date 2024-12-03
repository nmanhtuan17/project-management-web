import {TaskPriority} from "@/types/task.ts";
import {MultiSelect} from "@/components/ui/multi-select.tsx";
import {createElement, useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {taskConfig} from "@/configs/task.config.ts";
import {QuestionMarkIcon} from "@radix-ui/react-icons";

interface TaskPrioritySelectProps {
  showAllSelector?: boolean;
  multiple?: boolean;
  onChange?: (type: string | string[]) => void;
  showIcon?: boolean;
  className?: string;
  selected?: string | string[];
}

export function TaskPrioritySelect(props: TaskPrioritySelectProps) {
  const [items, setItems] = useState<string[] | string>(props.selected);

  const options = [{
    label: 'All',
    value: 'all',
  }, {
    label: 'Low',
    value: TaskPriority.LOW,
  }, {
    label: 'Medium',
    value: TaskPriority.MEDIUM,
  }, {
    label: 'High',
    value: TaskPriority.HIGH,
  }].filter(item => props.showAllSelector ? true : item.value !== 'all').map(item => {
    item.value = item.value.toString();
    return item as {label: string, value: string};
  });

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
    return <Select value={items as string} onValueChange={selected => {
      setItems(selected);
      props.onChange && props.onChange(selected);
    }}>
      <SelectTrigger className={props.className}>
        <SelectValue placeholder={items as string}/>
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem value={option.value} key={index}>
            <div className={'flex flex-row gap-1 items-center'}>
              {props.showIcon && createElement(taskConfig.priorities.find(t => t.value === parseInt(option.value))?.icon || QuestionMarkIcon as any, {
                className: 'w-4 h-4',
              })} {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  }
}
