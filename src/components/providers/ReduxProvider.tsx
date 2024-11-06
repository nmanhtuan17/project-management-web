import {Provider} from "react-redux";
import {ReactNode, useEffect, useState} from "react";
import {persistor, store, useAppDispatch, useAppSelector} from "@/redux/store.ts";
import {PersistGate} from "redux-persist/integration/react";
import apiService from "@/services/api.service.ts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { setAuth } from "@/redux/slices/auth.slice";

interface ReduxProviderProps {
  children: ReactNode;
}

const AuthProvider = ({children}: {children: ReactNode}) => {
  const dispatch = useAppDispatch();
  const {tokens, loggedIn} = useAppSelector(state => state.auth);
  const [authLoaded, setAuthLoaded] = useState(false);
  useEffect(() => {
    if (loggedIn && tokens.access_token) {
      apiService.setCredentials({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      }).then(() => setAuthLoaded(true)).catch(err => {
        dispatch(setAuth({
          loggedIn: false,
        }))
        setAuthLoaded(true);
      });
    } else {
      setAuthLoaded(true);
      dispatch(setAuth({
        loggedIn: false,
      }))
      setAuthLoaded(true);
    }
  }, []);
  if (!authLoaded) return <div className="flex justify-center items-center w-full h-full">
    <LoadingSpinner size={16}/>
  </div>;
  return children;
}

export default function ReduxProvider({children}: ReduxProviderProps) {
  return <PersistGate persistor={persistor}>
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  </PersistGate>
}
