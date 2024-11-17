import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar.tsx";
import dayjs from "dayjs";
import { useState } from "react";

interface TaskDatePopupPickerProps {
  date?: Date,
  placeholder?: string,
  onChange?: (date: Date) => void,
  className?: string,
}

export default function TaskDatePopupPicker({ date, placeholder, ...props }: TaskDatePopupPickerProps) {
  const [open, setOpen] = useState(false);
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={cn(
          "w-[280px] justify-start text-left font-normal",
          // !date && "text-muted-foreground"
          'w-full px-3',
          props.className
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>
          {date ? dayjs(date).format('MMMM D, YYYY') : placeholder || 'Pick a date'}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        initialFocus
        onDayClick={day => {
          setOpen(false);
          props.onChange && props.onChange(new Date(day));
        }}
      />
    </PopoverContent>
  </Popover>
}