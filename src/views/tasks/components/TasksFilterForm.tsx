import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label.tsx";
import { TaskTypeSelect } from "@/views/tasks/components/TaskTypeSelect.tsx";
import { TaskStatusSelect } from "@/views/tasks/components/TaskStatusSelect.tsx";
import { TaskPrioritySelect } from "@/views/tasks/components/TaskPrioritySelect.tsx";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { filterTask } from "@/redux/slices/task.slice.ts";
import { Button } from "@/components/ui/button";

export function TaskFilterForm() {
  const { filter } = useAppSelector(state => state.task)
  const dispatch = useAppDispatch();
  const [statuses, setStatuses] = useState<string[]>(filter.statuses);
  const [types, setTypes] = useState<string[]>(filter.types);
  const [priorities, setPriorities] = useState<any>(filter?.priorities);

  useEffect(() => {
    dispatch(filterTask({ statuses, types, priorities }))
  }, [statuses, types, priorities]);

  return <div>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium leading-none">
            Task Filter
          </h4>
          <p className="text-sm text-muted-foreground">
            Select filter for tasks listing...
          </p>
        </div>
        <Button className="inline-flex" size="sm">
          Save
        </Button>
      </div>
      <div className={'mt-2'}>
        <div>
          <Label>
            Type
          </Label>
          <TaskTypeSelect
            showAllSelector
            multiple
            selected={types}
            onChange={selected => setTypes(selected as string[])}
          />
        </div>
        <div>
          <Label>
            Status
          </Label>
          <TaskStatusSelect
            showAllSelector
            multiple
            selected={statuses}
            onChange={selected => setStatuses(selected as string[])}
          />
        </div>
        <div>
          <Label>
            Priority
          </Label>
          <TaskPrioritySelect
            showAllSelector
            multiple
            selected={priorities}
            onChange={selected => setPriorities(selected as string[])}
          />
        </div>
      </div>
    </div>
  </div>
}
