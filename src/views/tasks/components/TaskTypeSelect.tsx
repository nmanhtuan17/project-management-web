import { TaskTypes } from "@/types/task.ts";
import { MultiSelect, OptionType } from "@/components/ui/multi-select.tsx";
import { createElement, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { taskConfig } from "@/configs/task.config.ts";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";

interface TaskTypeSelectProps {
  showAllSelector?: boolean;
  multiple?: boolean;
  onChange?: (type: string | string[]) => void;
  showIcon?: boolean;
  className?: string;
  selected?: string | string[];
}

export function TaskTypeSelect(props: TaskTypeSelectProps) {
  const [types, setTypes] = useState<string[] | string>(props.selected);

  const options = [{
    label: 'All',
    value: 'all',
  }, {
    label: 'General',
    value: TaskTypes.GENERAL,
  }, {
    label: 'Issue',
    value: TaskTypes.ISSUE,
  }, {
    label: 'Bug',
    value: TaskTypes.BUG,
  },].filter(item => props.showAllSelector ? true : item.value !== 'all');

  useEffect(() => {
    if (props.selected !== types) setTypes(props.selected);
  }, [props.selected]);

  if (props.multiple) {
    return <MultiSelect
      className={props.className}
      selected={types as string[]}
      options={options}
      onChange={(selected: string[]) => {
        let filtered: string[] = selected;
        if (filtered[filtered.length - 1] === 'all') {
          // last item is all
          filtered = ['all'];
        } else if (selected.includes('all')) {
          filtered = filtered.filter(e => e !== 'all')
        }
        setTypes(filtered);
        props.onChange && props.onChange(filtered);
      }}
    />
  } else {
    return <Select
      value={types as string}
      onValueChange={selected => {
        setTypes(selected);
        props.onChange && props.onChange(selected);
      }}
    >
      <SelectTrigger className={props.className}>
        <SelectValue placeholder={types as string} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => {
          const Icon = taskConfig.types.find(t => t.value === option.value)?.icon || QuestionMarkCircleIcon;
          return (
            <SelectItem value={option.value} key={index}>
              <div className={'flex flex-row gap-1 items-center'}>
                {props.showIcon && <Icon className={'w-4 h-4'} />} {option.label}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  }
}
