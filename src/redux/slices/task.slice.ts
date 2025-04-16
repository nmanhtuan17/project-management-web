import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board, ETaskStatus, Task, TaskPriority, TaskTypes } from "@/types/task";
import { loadRecentTask, loadSingleTask, loadTasks, updateTask } from "@/redux/actions/task.action.ts";
import { toast } from "sonner";
import { loadKanbanBoard } from '@/redux/actions/project.action';

export const initBoard = {
  columns: [
    {
      id: 'pending',
      title: 'Todo',
      backgroundColor: '',
      cards: [],
    },
    {
      id: 'on_going',
      title: 'In Progress',
      backgroundColor: '',
      cards: [],
    },
    {
      id: 'review',
      title: 'Review',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      cards: [],
    },
    {
      id: 'completed',
      title: 'Completed',
      backgroundColor: 'rgba(21, 128, 61, 0.5)',
      cards: [],
    },
    {
      id: 'rejected',
      title: 'Rejected',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      cards: [],
    },
  ],
}

export interface TaskSliceState {
  tasks: Task[],
  filter: {
    types?: TaskTypes[],
    statuses?: ETaskStatus[],
    priorities?: TaskPriority[],
    assignees?: string[]
  },
  recentTasks: Task[],
  board: Board;
  loading: boolean;
}

const initialState: TaskSliceState = {
  tasks: [],
  recentTasks: [],
  filter: {
    types: [TaskTypes.ALL],
    statuses: [ETaskStatus.ALL],
    priorities: [TaskPriority.ALL],
    assignees: []
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
    // searchTask(state, action) {
    //   state.filter.query = action.payload
    // },
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
      .addCase(loadRecentTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadRecentTask.fulfilled, (state, action) => {
        state.recentTasks = action.payload;
        state.loading = false;
      })
      .addCase(loadRecentTask.rejected, (state) => {
        state.loading = true;
      })
      .addCase(loadSingleTask.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex(t => t._id === action.payload._id);
        if (taskIndex >= 0) {
          state.tasks[taskIndex] = action.payload;
        } else {
          state.tasks.push(action.payload);
        }
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
      })
      .addCase(updateTask.rejected, (state, action) => {
        toast.error(action.error.message);
      })
      .addCase(loadKanbanBoard.pending, (state, action) => {
        state.loading = true
      })
      .addCase(loadKanbanBoard.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.length > 0) {
          state.board = { columns: action.payload[0].columns }
        } else {
          state.board = { columns: [] }
        }
      })
      .addCase(loadKanbanBoard.rejected, (state, action) => {
        state.loading = false
      })

  }
});

export const {
  setTasks,
  filterTask,
  // searchTask,
  setBoard,
} = taskSlice.actions;
