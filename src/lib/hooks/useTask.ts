import { useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { useEffect, useState } from "react";
import apiService from "@/services/api.service.ts";
import { setTasks } from "@/redux/slices/task.slice.ts";
import { Task } from "@/types/task";
import useCurrentProject from "./useCurrentProject";
import { loadSingleTask } from "@/redux/actions/task.action";

interface UseTaskType {
  task?: Task;
  loading: boolean;
  error?: any;
  setTask?: (task: Task) => void;
}

export function useTask(taskId: string): UseTaskType {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<Task>(undefined);
  const [error, setError] = useState(null);
  const project = useCurrentProject();
  const { tasks } = useAppSelector(state => state.task);

  useEffect(() => {
    if (!taskId) return;
    const foundTask = tasks.find(x => x._id === taskId);
    if (foundTask) {
      setTask(foundTask);
    } else if (project._id) {
      setLoading(true);
      // call api
      dispatch(loadSingleTask({ projectId: project._id, taskId })).then(r => {
      }).catch(e => {
        setError(e);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [project, taskId, tasks]);

  return {
    loading,
    task,
    error,
    setTask: (task: Task) => {
      setTask(task);
      dispatch(setTasks({
        tasks: [...tasks.map(t => {
          if (t._id === taskId) {
            return task;
          } else return t;
        })]
      }))
    },
  };
}
