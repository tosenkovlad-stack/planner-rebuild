import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type WeekType = "numerator" | "denominator";

export interface ScheduleEntry {
  id: string;
  week_type: WeekType;
  day_of_week: number;
  lesson_number: number;
  subject: string;
  time: string;
  teacher: string;
}

export function useWeeklySchedule(weekType: WeekType) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["weekly_schedule", weekType],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("weekly_schedule")
        .select("*")
        .eq("user_id", user.id)
        .eq("week_type", weekType);
      if (error) throw error;
      return (data ?? []) as ScheduleEntry[];
    },
    enabled: !!user,
  });

  const upsertCell = useMutation({
    mutationFn: async (params: {
      day_of_week: number;
      lesson_number: number;
      subject: string;
      time: string;
      teacher: string;
    }) => {
      if (!user) return;
      const { error } = await supabase.from("weekly_schedule").upsert(
        { user_id: user.id, week_type: weekType, ...params },
        { onConflict: "user_id,week_type,day_of_week,lesson_number" }
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["weekly_schedule", weekType] }),
  });

  const getEntry = (day: number, lesson: number): { subject: string; time: string; teacher: string } => {
    const e = query.data?.find((e) => e.day_of_week === day && e.lesson_number === lesson);
    return { subject: e?.subject ?? "", time: e?.time ?? "", teacher: e?.teacher ?? "" };
  };

  return { entries: query.data ?? [], loading: query.isLoading, upsertCell, getEntry };
}
