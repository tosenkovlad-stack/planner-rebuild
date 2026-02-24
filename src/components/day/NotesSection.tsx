import { StickyNote, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  id: string;
  title: string;
  content: string | null;
}

interface Props {
  notes: Note[];
  onAdd: () => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export default function NotesSection({ notes, onAdd, onUpdate, onDelete }: Props) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <StickyNote className="h-4 w-4" />
          Notes
        </div>
        <Button variant="ghost" size="sm" onClick={onAdd} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      <div className="space-y-3">
        {notes.length === 0 && <p className="text-sm text-muted-foreground/50">No notes yet</p>}
        {notes.map(note => (
          <div key={note.id} className="group rounded-md border border-border bg-secondary/20 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-primary">{note.title}</span>
              <button onClick={() => onDelete(note.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
            <Textarea
              value={note.content ?? ""}
              onChange={e => onUpdate(note.id, e.target.value)}
              placeholder="Write your note..."
              className="min-h-[60px] resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
