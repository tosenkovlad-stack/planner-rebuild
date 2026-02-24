import { useState } from "react";
import { CheckSquare, Plus, Trash2, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  urgency: string;
  is_completed: boolean;
  task_comments: { id: string; content: string; created_at: string }[];
}

interface Props {
  tasks: Task[];
  onAdd: (t: { title: string; urgency: string }) => void;
  onToggle: (id: string, v: boolean) => void;
  onDelete: (id: string) => void;
  onAddComment: (taskId: string, content: string) => void;
}

export default function TasksSection({ tasks, onAdd, onToggle, onDelete, onAddComment }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [urgency, setUrgency] = useState("not_urgent");
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({ title, urgency });
    setTitle("");
    setUrgency("not_urgent");
    setAdding(false);
  };

  const handleComment = (taskId: string) => {
    if (!comment.trim()) return;
    onAddComment(taskId, comment);
    setComment("");
    setCommentingId(null);
  };

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <CheckSquare className="h-4 w-4" />
          Tasks
        </div>
        <Button variant="ghost" size="sm" onClick={() => setAdding(!adding)} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {adding && (
        <div className="mb-3 space-y-2 rounded-md border border-border bg-secondary/30 p-3">
          <Input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={urgency === "not_urgent"} onChange={() => setUrgency("not_urgent")} className="accent-primary" />
              Normal
            </label>
            <label className="flex items-center gap-2 text-sm text-warning">
              <input type="radio" checked={urgency === "urgent"} onChange={() => setUrgency("urgent")} className="accent-warning" />
              <AlertTriangle className="h-3 w-3" /> Urgent
            </label>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {tasks.length === 0 && !adding && <p className="text-sm text-muted-foreground/50">No tasks yet</p>}
        {tasks.map(task => (
          <div key={task.id} className="group">
            <div className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/30">
              <Checkbox checked={task.is_completed} onCheckedChange={(v) => onToggle(task.id, !!v)} />
              <span className={cn("flex-1 text-sm", task.is_completed && "line-through text-muted-foreground")}>
                {task.title}
              </span>
              {task.urgency === "urgent" && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
              <button onClick={() => setCommentingId(commentingId === task.id ? null : task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
            {task.task_comments?.length > 0 && (
              <div className="ml-9 space-y-1 pb-1">
                {task.task_comments.map(c => (
                  <p key={c.id} className="text-xs text-muted-foreground">{c.content}</p>
                ))}
              </div>
            )}
            {commentingId === task.id && (
              <div className="ml-9 flex gap-2 pb-2">
                <Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." className="h-7 text-xs" />
                <Button size="sm" className="h-7 text-xs" onClick={() => handleComment(task.id)}>Add</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
