import { CalendarDays, CalendarCheck, ListTodo, Settings, LogOut, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "today", label: "Today", icon: CalendarCheck },
  { id: "tasks", label: "All Tasks", icon: ListTodo },
  { id: "weekly", label: "Weekly Schedule", icon: GraduationCap },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { signOut, user } = useAuth();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-5">
        <CalendarDays className="h-6 w-6 text-primary" />
        <span className="font-heading text-lg font-semibold text-sidebar-accent-foreground">Super V</span>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              currentView === item.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <p className="mb-2 truncate px-2 text-xs text-muted-foreground">{user?.email}</p>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
