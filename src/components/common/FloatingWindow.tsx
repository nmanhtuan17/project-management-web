import { XMarkIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { MouseEventHandler, useState } from "react";
import { FloatingWindowType, useFloatingWindowCtx } from "../providers/FloatingWindowProvider";

interface FloatingWindowProps {
  window: FloatingWindowType;
}

export function FloatingWindow(props: FloatingWindowProps) {
  const [size, setSize] = useState({ width: props.window.width, height: props.window.height });
  const { closeWindow } = useFloatingWindowCtx();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const close = () => closeWindow(props.window.id);


  const handler = (mouseDownEvent: any) => {
    mouseDownEvent.preventDefault();
    mouseDownEvent.stopPropagation();
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent: any) {
      setSize(currentSize => ({
        width: startSize.width + (startPosition.x - mouseMoveEvent.pageX),
        height: startSize.height + (startPosition.y - mouseMoveEvent.pageY)
      }));
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return <div
    className={'bg-background flex flex-col relative'} style={{
      width: size.width,
      height: collapsed ? 'initial' : size.height,
    }}
  >
    <div className={'w-4 h-4 absolute -left-2 -top-2 cursor-nw-resize'} onMouseDown={handler}></div>
    <div className={'flex flex-row items-center bg-primary text-primary-foreground rounded-t-lg'}>
      <div className={'text-sm flex-1 px-3 py-2'}>
        {props.window.title || "Window"}
      </div>
      <div>
        <Button size={'sm'} className={'px-2'}
          icon={collapsed ? <ChevronUpIcon className={'w-4 h-4'} /> : <ChevronDownIcon className={'w-4 h-4'} />}
          onClick={toggleCollapse} />
        <Button size={'sm'} className={'px-2'} icon={<XMarkIcon className={'w-4 h-4'} />} onClick={close} />
      </div>
    </div>
    {!collapsed && (
      <div className={'flex flex-1 border-x overflow-y-auto'}>
        {props.window.children}
      </div>
    )}
  </div>
}
