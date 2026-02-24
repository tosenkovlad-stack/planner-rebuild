import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { format } from "date-fns";

export function useDayData(date: Date) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dateStr = format(date, "yyyy-MM-dd");

  const dayQuery = useQuery({
    queryKey: ["day", dateStr],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("days")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", dateStr)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const ensureDay = async () => {
    if (!user) return null;
    let day = dayQuery.data;
    if (!day) {
      const { data, error } = await supabase
        .from("days")
        .upsert({ user_id: user.id, date: dateStr, affirmation: "" }, { onConflict: "user_id,date" })
        .select()
        .single();
      if (error) throw error;
      day = data;
      queryClient.invalidateQueries({ queryKey: ["day", dateStr] });
    }
    return day;
  };

  const updateAffirmation = useMutation({
    mutationFn: async (affirmation: string) => {
      const day = await ensureDay();
      if (!day) return;
      await supabase.from("days").update({ affirmation }).eq("id", day.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["day", dateStr] }),
  });

  // Schedule items
  const scheduleQuery = useQuery({
    queryKey: ["schedule", dateStr],
    queryFn: async () => {
      if (!user) return [];
      const day = dayQuery.data;
      if (!day) return [];
      const { data, error } = await supabase
        .from("schedule_items")
        .select("*")
        .eq("day_id", day.id)
        .order("start_time");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && !!dayQuery.data,
  });

  const addScheduleItem = useMutation({
    mutationFn: async (item: { start_time: string; end_time: string; title: string; description?: string }) => {
      const day = await ensureDay();
      if (!day || !user) return;
      const { error } = await supabase.from("schedule_items").insert({ ...item, day_id: day.id, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schedule", dateStr] }),
  });

  const deleteScheduleItem = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("schedule_items").delete().eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schedule", dateStr] }),
  });

  // Tasks
  const tasksQuery = useQuery({
    queryKey: ["tasks", dateStr],
    queryFn: async () => {
      if (!user) return [];
      const day = dayQuery.data;
      if (!day) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*, task_comments(*)")
        .eq("day_id", day.id)
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && !!dayQuery.data,
  });

  const addTask = useMutation({
    mutationFn: async (item: { title: string; urgency: string }) => {
      const day = await ensureDay();
      if (!day || !user) return;
      const { error } = await supabase.from("tasks").insert({ ...item, day_id: day.id, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", dateStr] }),
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
      await supabase.from("tasks").update({ is_completed }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", dateStr] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("tasks").delete().eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", dateStr] }),
  });

  const addTaskComment = useMutation({
    mutationFn: async ({ task_id, content }: { task_id: string; content: string }) => {
      if (!user) return;
      const { error } = await supabase.from("task_comments").insert({ task_id, user_id: user.id, content });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", dateStr] }),
  });

  // Notes
  const notesQuery = useQuery({
    queryKey: ["notes", dateStr],
    queryFn: async () => {
      if (!user) return [];
      const day = dayQuery.data;
      if (!day) return [];
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("day_id", day.id)
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && !!dayQuery.data,
  });

  const addNote = useMutation({
    mutationFn: async (title: string) => {
      const day = await ensureDay();
      if (!day || !user) return;
      const { error } = await supabase.from("notes").insert({ title, day_id: day.id, user_id: user.id, content: "" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes", dateStr] }),
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      await supabase.from("notes").update({ content }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes", dateStr] }),
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("notes").delete().eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes", dateStr] }),
  });

  // Attachments
  const attachmentsQuery = useQuery({
    queryKey: ["attachments", dateStr],
    queryFn: async () => {
      if (!user) return [];
      const day = dayQuery.data;
      if (!day) return [];
      const { data, error } = await supabase
        .from("attachments")
        .select("*")
        .eq("day_id", day.id)
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && !!dayQuery.data,
  });

  const addLink = useMutation({
    mutationFn: async ({ url, label }: { url: string; label: string }) => {
      const day = await ensureDay();
      if (!day || !user) return;
      const { error } = await supabase.from("attachments").insert({ day_id: day.id, user_id: user.id, type: "link", url, label });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attachments", dateStr] }),
  });

  const addImage = useMutation({
    mutationFn: async (file: File) => {
      const day = await ensureDay();
      if (!day || !user) return;
      const path = `${user.id}/${day.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("attachments").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("attachments").getPublicUrl(path);
      const { error } = await supabase.from("attachments").insert({ day_id: day.id, user_id: user.id, type: "image", url: urlData.publicUrl, label: file.name });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attachments", dateStr] }),
  });

  const deleteAttachment = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("attachments").delete().eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attachments", dateStr] }),
  });

  return {
    day: dayQuery.data,
    dayLoading: dayQuery.isLoading,
    updateAffirmation,
    schedule: scheduleQuery.data ?? [],
    addScheduleItem,
    deleteScheduleItem,
    tasks: tasksQuery.data ?? [],
    addTask,
    toggleTask,
    deleteTask,
    addTaskComment,
    notes: notesQuery.data ?? [],
    addNote,
    updateNote,
    deleteNote,
    attachments: attachmentsQuery.data ?? [],
    addLink,
    addImage,
    deleteAttachment,
  };
}
