import { Provider } from "react-redux";
import { ReactNode, useEffect, useState } from "react";
import { persistor, store, useAppDispatch, useAppSelector } from "@/redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import apiService from "@/services/api.service.ts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { setAuth } from "@/redux/slices/auth.slice";

interface ReduxProviderProps {
  children: ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <PersistGate persistor={persistor}>
    <Provider store={store}>
      {children}
    </Provider>
  </PersistGate>
}
