import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface DatePickerProps {
  id?: string
  name?: string
  label?: string
  value?: string // ISO8601 date string
  onChange?: (date: string | undefined) => void
  error?: string
  disabled?: boolean
  required?: boolean
  disablePastDays?: boolean
  weekMode?: boolean
  testid?: string
  className?: string
}

export function DatePicker({
  id,
  name,
  label,
  value,
  onChange,
  error,
  disabled,
  required,
  disablePastDays = false,
  weekMode = false,
  testid,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const date = value ? new Date(value) : undefined

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange?.(selectedDate.toISOString())
      setOpen(false)
    } else {
      onChange?.(undefined)
    }
  }

  const disabledDays = disablePastDays
    ? { before: new Date(new Date().setHours(0, 0, 0, 0)) }
    : undefined

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            name={name}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              error && "border-destructive"
            )}
            data-testid={testid}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={disabledDays}
            weekStartsOn={weekMode ? 1 : 0}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p
          className="text-sm font-medium text-destructive"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}
