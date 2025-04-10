import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label.tsx";
import { TaskTypeSelect } from "@/views/tasks/components/TaskTypeSelect.tsx";
import { TaskStatusSelect } from "@/views/tasks/components/TaskStatusSelect.tsx";
import { TaskPrioritySelect } from "@/views/tasks/components/TaskPrioritySelect.tsx";
import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { filterTask } from "@/redux/slices/task.slice.ts";
import { Button } from "@/components/ui/button";
import { loadTasks } from "@/redux/actions/task.action";
import { useCurrentProject } from "@/lib/hooks/useCurrentProject";
import CreateTaskMemberSelector from "@/views/tasks/components/CreateTaskMemberSelector";
import AssigneesSelector from "@/components/common/AssigneesSelector";

interface Props {
  setOpen: (val: boolean) => void;
}

export function TaskFilterForm({ setOpen }: Props) {
  const { filter } = useAppSelector(state => state.task)
  const dispatch = useAppDispatch();
  const { currentProject } = useCurrentProject()
  const [statuses, setStatuses] = useState<string[]>(filter.statuses);
  const [types, setTypes] = useState<string[]>(filter.types);
  const [priorities, setPriorities] = useState<any>(filter?.priorities);
  const [assignees, setAssignees] = useState<string[]>(filter?.assignees || [])

  useEffect(() => {
    dispatch(filterTask({ statuses, types, priorities, assignees }))
  }, [statuses, types, priorities, assignees]);

  const handleSearch = () => {
    dispatch(loadTasks({ projectId: currentProject._id }));
    setOpen(false)
  }

  return <div>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium leading-none">
            Lọc
          </h4>
          <p className="text-sm text-muted-foreground">
            Lọc công viêc theo các trạng thái...
          </p>
        </div>
        <Button onClick={handleSearch}
          className="inline-flex"
          size="sm">
          Lọc
        </Button>
      </div>
      <div className={'mt-2'}>
        <div>
          <Label>
            Phân lọai
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
            Trạng thái
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
            Độ ưu tiên
          </Label>
          <TaskPrioritySelect
            showAllSelector
            multiple
            selected={priorities}
            onChange={selected => setPriorities(selected as string[])}
          />
        </div>
        <div>
          <Label>
            Người phụ trách
          </Label>
          <AssigneesSelector
            assignees={assignees}
            onChange={(members) => setAssignees(members)} />
        </div>
      </div>
    </div>
  </div>
}
