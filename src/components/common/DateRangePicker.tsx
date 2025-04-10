"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import dayjs from "dayjs"


interface CalendarDateRangePickerProps {
  className?: string
  date?: DateRange
  onChange?: (date: DateRange) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  min?: Date;
  max?: Date;
}

export function CalendarDateRangePicker({
  className,
  date,
  onChange,
  variant,
  min, max
}: CalendarDateRangePickerProps) {


  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={variant ?? "outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {dayjs(date.from).format('D MMMM, YYYY')} -{" "}
                  {dayjs(date.to).format('D MMMM, YYYY')}
                </>
              ) : (
                dayjs(date.from).format('D MMMM, YYYY')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            fromDate={min}
            toDate={max}
            onSelect={(range) => {
              onChange({
                from: new Date(range.from),
                to: new Date(range.to)
              })
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
