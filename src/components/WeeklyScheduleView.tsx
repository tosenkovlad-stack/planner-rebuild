import { useState } from "react";
import { useWeeklySchedule, WeekType } from "@/hooks/useWeeklySchedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ROW1 = [
  { num: 1, label: "Mon" },
  { num: 2, label: "Tue" },
  { num: 3, label: "Wed" },
];

const ROW2 = [
  { num: 4, label: "Thu" },
  { num: 5, label: "Fri" },
  { num: 6, label: "Sat" },
];

const LESSONS = [1, 2, 3, 4];
type Field = "subject" | "time";

function DayTable({
  day,
  getEntry,
  editing,
  draft,
  setDraft,
  startEdit,
  commitEdit,
}: {
  day: { num: number; label: string };
  getEntry: (d: number, l: number) => { subject: string; time: string; teacher: string };
  editing: { day: number; lesson: number; field: Field } | null;
  draft: string;
  setDraft: (v: string) => void;
  startEdit: (d: number, l: number, f: Field) => void;
  commitEdit: () => void;
}) {
  const renderCell = (lesson: number, field: Field) => {
    const isEditing = editing?.day === day.num && editing?.lesson === lesson && editing?.field === field;
    const value = getEntry(day.num, lesson)[field];

    if (isEditing) {
      return (
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => e.key === "Enter" && commitEdit()}
          className="h-7 text-xs"
        />
      );
    }

    return (
      <span
        className="block w-full cursor-pointer rounded px-1 py-0.5 text-xs hover:bg-muted/60 transition-colors min-h-[1.5rem]"
        onClick={() => startEdit(day.num, lesson, field)}
      >
        {value || <span className="text-muted-foreground">—</span>}
      </span>
    );
  };

  return (
    <div className="flex-1 min-w-0 rounded-lg border border-border overflow-hidden">
      <div className="bg-secondary/50 px-3 py-1.5">
        <h2 className="font-heading text-sm font-semibold">{day.label}</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-center p-1">#</TableHead>
            <TableHead className="p-1">Subject</TableHead>
            <TableHead className="p-1 w-[35%]">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {LESSONS.map((lesson) => (
            <TableRow key={lesson}>
              <TableCell className="text-center font-medium text-muted-foreground p-1">{lesson}</TableCell>
              <TableCell className="p-1">{renderCell(lesson, "subject")}</TableCell>
              <TableCell className="p-1">{renderCell(lesson, "time")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function WeeklyScheduleView() {
  const [weekType, setWeekType] = useState<WeekType>("numerator");
  const { getEntry, upsertCell, loading } = useWeeklySchedule(weekType);
  const [editing, setEditing] = useState<{ day: number; lesson: number; field: Field } | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (day: number, lesson: number, field: Field) => {
    setEditing({ day, lesson, field });
    setDraft(getEntry(day, lesson)[field]);
  };

  const commitEdit = () => {
    if (!editing) return;
    const current = getEntry(editing.day, editing.lesson);
    upsertCell.mutate({
      day_of_week: editing.day,
      lesson_number: editing.lesson,
      subject: editing.field === "subject" ? draft : current.subject,
      time: editing.field === "time" ? draft : current.time,
      teacher: current.teacher,
    });
    setEditing(null);
  };

  const sharedProps = { getEntry, editing, draft, setDraft, startEdit, commitEdit };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Weekly Schedule</h1>
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          <Button size="sm" variant={weekType === "numerator" ? "default" : "ghost"} onClick={() => setWeekType("numerator")}>
            Numerator
          </Button>
          <Button size="sm" variant={weekType === "denominator" ? "default" : "ghost"} onClick={() => setWeekType("denominator")}>
            Denominator
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4">
            {ROW1.map((day) => (
              <DayTable key={day.num} day={day} {...sharedProps} />
            ))}
          </div>
          <div className="flex gap-4">
            {ROW2.map((day) => (
              <DayTable key={day.num} day={day} {...sharedProps} />
            ))}
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 px-4 py-2 text-center">
            <p className="text-sm text-muted-foreground italic">Sunday — Day off</p>
          </div>
        </div>
      )}
    </div>
  );
}
