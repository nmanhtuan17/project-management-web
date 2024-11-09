import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board, Task, TaskPriority, TaskStatus, TaskTypes } from "@/types/task";
import { loadSingleTask, loadTasks, updateTask } from "@/redux/actions/task.action.ts";
import { toast } from "sonner";

export const initBoard = {
  columns: [
    {
      id: 'pending',
      title: 'Todo',
      cards: [
        {
          id: 1,
          title: 'Add card',
          description: 'Add capability to add a card in a column'
        },
      ],
    },
    {
      id: 'on_going',
      title: 'In Progress',
      cards: [],
    },
    {
      id: 'review',
      title: 'Review',
      cards: [],
    },
    {
      id: 'completed',
      title: 'Completed',
      cards: [],
    },
    {
      id: 'rejected',
      title: 'Rejected',
      cards: [],
    },
  ],
}

export interface TaskSliceState {
  tasks: Task[],
  filter: {
    types?: TaskTypes[],
    statuses?: TaskStatus[],
    priorities?: TaskPriority[],
    search?: string;
  },
  board: Board;
  loading: boolean;
}

const initialState: TaskSliceState = {
  tasks: [],
  filter: {
    search: '',
    types: [TaskTypes.ALL],
    statuses: [TaskStatus.ALL],
    priorities: [TaskPriority.ALL],
  },
  board: initBoard,
  loading: true
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Partial<TaskSliceState>>) {
      state = {
        ...state,
        ...action.payload,
      }
      return state;
    },
    filterTask(state, action: PayloadAction<Partial<TaskSliceState>>) {
      state.filter = {
        ...state.filter,
        ...action.payload
      }
    },
    searchTask(state, action) {
      state.filter.search = action.payload
    },
    setBoard(state, action: PayloadAction<Board>) {
      state.board = action.payload;
    },
    mapTaskToBoard(state, _action: PayloadAction<any>) {
      state.board.columns = state.board.columns.map(col => ({
        ...col,
        cards: [],
      }));
      const clonedTasks = state.tasks.slice()
      clonedTasks.forEach(task => {
        const colIndex = state.board.columns.findIndex(col => col.id === task.status);
        if (colIndex >= 0) {
          state.board.columns[colIndex].cards.push({
            ...task,
            id: task._id
          });
        }
      });
      state.board = { ...state.board };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
        taskSlice.caseReducers.mapTaskToBoard(state, action);
      })
      .addCase(loadTasks.rejected, (state) => {
        state.loading = true;
      })
      .addCase(loadSingleTask.fulfilled, (state, action) => {
        // const taskIndex = state.tasks.findIndex(t => t._id === action.payload._id);
        // if (taskIndex >= 0) {
        //   state.tasks[taskIndex] = action.payload;
        // } else {
        //   state.tasks.push(action.payload);
        // }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex(t => t._id === action.payload.data.task._id);
        if (taskIndex >= 0) {
          state.tasks[taskIndex] = action.payload.data.task;
        } else {
          state.tasks.push(action.payload.data.task);
        }
        toast.success(action.payload.message);
        taskSlice.caseReducers.mapTaskToBoard(state, action);
      }).addCase(updateTask.rejected, (state, action) => {
        toast.error(action.error.message);
      });
  }
});

export const {
  setTasks,
  filterTask,
  searchTask,
  setBoard,
} = taskSlice.actions;
