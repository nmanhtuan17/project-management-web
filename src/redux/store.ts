import { appSlice, AppSliceState } from '@/redux/slices/app.slice';
import { authSlice, AuthSliceState } from '@/redux/slices/auth.slice';
import { projectSlice, ProjectSliceState } from '@/redux/slices/project.slice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { appMiddleware } from './middleware/app.middleware';
import { filterTask, taskSlice, TaskSliceState } from '@/redux/slices/task.slice';

const reducers = combineReducers({
  app: appSlice.reducer,
  auth: authSlice.reducer,
  project: projectSlice.reducer,
  task: persistReducer({
    key: 'tasks',
    storage,
    blacklist: ['filter']
  }, taskSlice.reducer)
})

const persistedReducer = persistReducer({
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
}, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).prepend(appMiddleware.middleware),
});

export const persistor = persistStore(store);

export type RootState = {
  app: AppSliceState;
  auth: AuthSliceState;
  project: ProjectSliceState;
  task: TaskSliceState;
};

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;