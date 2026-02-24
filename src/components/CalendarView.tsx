import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function CalendarView({ selectedDate, onSelectDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let d = calStart;
  while (d <= calEnd) {
    days.push(d);
    d = addDays(d, 1);
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-heading text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(wd => (
          <div key={wd} className="py-2 text-center text-xs font-medium text-muted-foreground">{wd}</div>
        ))}
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() => { onSelectDate(day); }}
            className={cn(
              "flex h-12 items-center justify-center rounded-md text-sm transition-colors",
              !isSameMonth(day, currentMonth) && "text-muted-foreground/40",
              isSameDay(day, today) && "border border-primary/50",
              isSameDay(day, selectedDate) && "bg-primary text-primary-foreground",
              !isSameDay(day, selectedDate) && "hover:bg-muted"
            )}
          >
            {format(day, "d")}
          </button>
        ))}
      </div>
    </div>
  );
}
