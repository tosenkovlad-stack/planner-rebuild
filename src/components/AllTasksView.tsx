import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AllTasksView() {
  const { user } = useAuth();

  const { data: tasks = [] } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*, days(date)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const toggleTask = async (id: string, is_completed: boolean) => {
    await supabase.from("tasks").update({ is_completed }).eq("id", id);
  };

  const incomplete = tasks.filter(t => !t.is_completed);
  const completed = tasks.filter(t => t.is_completed);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 font-heading text-2xl font-bold">All Tasks</h1>

      <div className="space-y-1">
        {incomplete.length === 0 && <p className="text-sm text-muted-foreground">No pending tasks 🎉</p>}
        {incomplete.map(task => (
          <div key={task.id} className="flex items-center gap-3 rounded-md border border-border bg-card p-3">
            <Checkbox checked={false} onCheckedChange={() => toggleTask(task.id, true)} />
            <span className="flex-1 text-sm">{task.title}</span>
            {task.urgency === "urgent" && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
            <span className="text-xs text-muted-foreground">{task.days?.date ? format(new Date(task.days.date), "MMM d") : ""}</span>
          </div>
        ))}
      </div>

      {completed.length > 0 && (
        <>
          <h2 className="mb-2 mt-6 font-heading text-sm font-medium text-muted-foreground">Completed</h2>
          <div className="space-y-1">
            {completed.map(task => (
              <div key={task.id} className="flex items-center gap-3 rounded-md p-3 opacity-50">
                <Checkbox checked={true} onCheckedChange={() => toggleTask(task.id, false)} />
                <span className="flex-1 text-sm line-through">{task.title}</span>
                <span className="text-xs text-muted-foreground">{task.days?.date ? format(new Date(task.days.date), "MMM d") : ""}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
