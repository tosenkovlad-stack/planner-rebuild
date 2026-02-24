import { useState } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ScheduleItem {
  id: string;
  start_time: string;
  end_time: string;
  title: string;
  description: string | null;
}

interface Props {
  items: ScheduleItem[];
  onAdd: (item: { start_time: string; end_time: string; title: string; description?: string }) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleSection({ items, onAdd, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ start_time: "09:00", end_time: "10:00", title: "", description: "" });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    onAdd(form);
    setForm({ start_time: "09:00", end_time: "10:00", title: "", description: "" });
    setAdding(false);
  };

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Clock className="h-4 w-4" />
          Schedule
        </div>
        <Button variant="ghost" size="sm" onClick={() => setAdding(!adding)} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {adding && (
        <div className="mb-3 space-y-2 rounded-md border border-border bg-secondary/30 p-3">
          <div className="flex gap-2">
            <Input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} className="w-32" />
            <span className="self-center text-muted-foreground">→</span>
            <Input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} className="w-32" />
          </div>
          <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Input placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && !adding && <p className="text-sm text-muted-foreground/50">No schedule items yet</p>}
        {items.map(item => (
          <div key={item.id} className="group flex items-start gap-3 rounded-md p-2 hover:bg-muted/30">
            <span className="mt-0.5 whitespace-nowrap text-xs font-medium text-primary">
              {item.start_time?.slice(0, 5)} – {item.end_time?.slice(0, 5)}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
            </div>
            <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
