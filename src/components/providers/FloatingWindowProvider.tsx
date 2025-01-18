import {createContext, ReactNode, useContext, useState} from "react";
import {v4} from "uuid";
import {Outlet} from "react-router-dom";
import { FloatingWindow } from "../common/FloatingWindow";

export interface FloatingWindowType {
  id: string;
  width: number;
  height: number;
  resizable?: boolean;
  children: ReactNode;
  title?: string;
}

interface FloatingWindowProviderProps {
  children?: ReactNode;
}

interface FloatingWindowContextProps {
  windows: FloatingWindowType[],
  createWindow?: (window: Omit<FloatingWindowType, 'id'>) => void,
  closeWindow?: (windowId: string) => void,
  updateWindow?: (windowId: string, updated: Partial<FloatingWindowType>) => void,
}

const FloatingWindowContext = createContext<FloatingWindowContextProps>({
  windows: [],
});

export const useFloatingWindowCtx = () => useContext(FloatingWindowContext);

export default function FloatingWindowProvider(props: FloatingWindowProviderProps) {
  const [windows, setWindows] = useState<FloatingWindowType[]>([]);

  const createWindow = (window: Omit<FloatingWindowType, 'id'>) => {
    setWindows(win => [...win, {
      ...window,
      id: v4()
    }]);
  };

  const closeWindow = (windowId: string) => setWindows(win => [...win.filter(w => w.id !== windowId)]);
  const updateWindow = (windowId: string, updateWindow: Partial<FloatingWindowType>) => {
    return setWindows(win => [...win.map(w => {
      if (w.id === windowId) return {
        ...w,
        ...updateWindow,
        id: w.id,
      };
      return w;
    })])
  }

  return <FloatingWindowContext.Provider value={{
    windows,
    createWindow,
    closeWindow,
  }}>
    {props.children || <Outlet/>}
    <div className={'fixed flex flex-row right-0 bottom-0 mx-8 z-40 gap-2 items-end'}>
      {windows.map(win => (
        <FloatingWindow window={win} key={win.id}/>
      ))}
    </div>
  </FloatingWindowContext.Provider>
}
