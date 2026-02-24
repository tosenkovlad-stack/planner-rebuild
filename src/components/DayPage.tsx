import { format, addDays, subDays, getDay } from "date-fns";
import { useDayData } from "@/hooks/useDayData";
import { useWeeklySchedule } from "@/hooks/useWeeklySchedule";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AffirmationSection from "./day/AffirmationSection";
import ScheduleSection from "./day/ScheduleSection";
import TasksSection from "./day/TasksSection";
import NotesSection from "./day/NotesSection";
import AttachmentsSection from "./day/AttachmentsSection";
import { useState } from "react";
import type { WeekType } from "@/hooks/useWeeklySchedule";

interface DayPageProps {
  date: Date;
  onDateChange?: (date: Date) => void;
}

const LESSONS = [1, 2, 3, 4];

export default function DayPage({ date, onDateChange }: DayPageProps) {
  const data = useDayData(date);
  const [weekType, setWeekType] = useState<WeekType>("numerator");
  const { getEntry } = useWeeklySchedule(weekType);

  // getDay: 0=Sun,1=Mon..6=Sat — our DB uses 1=Mon..6=Sat
  const jsDay = getDay(date);
  const dayOfWeek = jsDay === 0 ? 0 : jsDay; // 0 = Sunday
  const isSunday = dayOfWeek === 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => onDateChange?.(subDays(date, 1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-heading text-2xl font-bold">{format(date, "EEEE, MMMM d, yyyy")}</h1>
        <Button variant="ghost" size="icon" onClick={() => onDateChange?.(addDays(date, 1))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <AffirmationSection value={data.day?.affirmation ?? ""} onSave={(v) => data.updateAffirmation.mutate(v)} />
      <ScheduleSection items={data.schedule} onAdd={(item) => data.addScheduleItem.mutate(item)} onDelete={(id) => data.deleteScheduleItem.mutate(id)} />
      <TasksSection tasks={data.tasks} onAdd={(t) => data.addTask.mutate(t)} onToggle={(id, v) => data.toggleTask.mutate({ id, is_completed: v })} onDelete={(id) => data.deleteTask.mutate(id)} onAddComment={(task_id, content) => data.addTaskComment.mutate({ task_id, content })} />
      <NotesSection notes={data.notes} onAdd={() => data.addNote.mutate(`Note ${data.notes.length + 1}`)} onUpdate={(id, content) => data.updateNote.mutate({ id, content })} onDelete={(id) => data.deleteNote.mutate(id)} />
      <AttachmentsSection attachments={data.attachments} onAddLink={(url, label) => data.addLink.mutate({ url, label })} onAddImage={(file) => data.addImage.mutate(file)} onDelete={(id) => data.deleteAttachment.mutate(id)} />

      {/* University schedule for this day */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">University Schedule</h2>
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            <Button size="sm" variant={weekType === "numerator" ? "default" : "ghost"} onClick={() => setWeekType("numerator")}>
              Num
            </Button>
            <Button size="sm" variant={weekType === "denominator" ? "default" : "ghost"} onClick={() => setWeekType("denominator")}>
              Den
            </Button>
          </div>
        </div>

        {isSunday ? (
          <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3 text-center">
            <p className="text-sm text-muted-foreground italic">Day off</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="w-[30%]">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LESSONS.map((lesson) => {
                  const entry = getEntry(dayOfWeek, lesson);
                  return (
                    <TableRow key={lesson}>
                      <TableCell className="text-center font-medium text-muted-foreground">{lesson}</TableCell>
                      <TableCell className="text-sm">{entry.subject || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.time || "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
