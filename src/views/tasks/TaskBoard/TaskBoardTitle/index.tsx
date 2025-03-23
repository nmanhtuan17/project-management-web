
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { useDialogContext } from "@/components/providers/DialogProvider";
import { BoardColumn } from "@/types/task";
import { useReducer, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, Delete, Ellipsis, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

interface TaskBoardTitleProps {
  column: BoardColumn;
}

export default function TaskBoardTitle(props: TaskBoardTitleProps) {
  const { column } = props;

  return (
    <div className="flex items-center justify-between mb-4 pl-2 pr-[10px]">
      <p
        className="font-medium text-[14px]">
        {column.title}
      </p>
    </div>
  )
};
