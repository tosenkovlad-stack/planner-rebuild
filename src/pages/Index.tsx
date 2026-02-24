import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import CalendarView from "@/components/CalendarView";
import DayPage from "@/components/DayPage";
import AllTasksView from "@/components/AllTasksView";
import SettingsView from "@/components/SettingsView";
import WeeklyScheduleView from "@/components/WeeklyScheduleView";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Index() {
  const { user, loading } = useAuth();
  const [view, setView] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setView("day");
  };

  const renderContent = () => {
    switch (view) {
      case "calendar":
        return <CalendarView selectedDate={selectedDate} onSelectDate={handleSelectDate} />;
      case "today":
        return <DayPage date={new Date()} onDateChange={(d) => { setSelectedDate(d); setView("day"); }} />;
      case "day":
        return <DayPage date={selectedDate} onDateChange={(d) => setSelectedDate(d)} />;
      case "tasks":
        return <AllTasksView />;
      case "weekly":
        return <WeeklyScheduleView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DayPage date={new Date()} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar currentView={view} onViewChange={setView} />
      <ScrollArea className="flex-1">
        {renderContent()}
      </ScrollArea>
    </div>
  );
}
