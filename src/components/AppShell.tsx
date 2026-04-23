import { NavLink } from "react-router-dom";
import { LayoutDashboard, Briefcase, Users, Cpu, BarChart3, Settings, Bell, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { to: "/",            icon: LayoutDashboard, label: "Dashboard" },
  { to: "/jobs",        icon: Briefcase,       label: "Jobs" },
  { to: "/candidates",  icon: Users,           label: "Candidates" },
  { to: "/simulations", icon: Cpu,             label: "Simulations" },
  { to: "/reports",     icon: BarChart3,       label: "Reports" },
  { to: "/settings",    icon: Settings,        label: "Settings" },
];

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col items-center border-r border-border bg-card">
      <div className="flex h-16 w-full items-center justify-center border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-card">
          <Rocket className="h-5 w-5" strokeWidth={2.25} />
        </div>
      </div>
      <TooltipProvider delayDuration={150}>
        <nav className="flex flex-1 flex-col items-center gap-1 py-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Tooltip key={to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-primary-soft text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute -left-3 h-6 w-1 rounded-r-full bg-primary" />
                      )}
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </>
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12} className="font-medium">
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}

function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-tight">Edtronaut</span>
        <span className="ml-2 rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
          TA Suite
        </span>
      </div>
      <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-card" />
        </button>
        <div className="flex items-center gap-2 rounded-lg pl-2">
          <div className="text-right leading-tight">
            <div className="text-xs font-semibold">Linh Tran</div>
            <div className="text-[11px] text-muted-foreground">Senior Recruiter</div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-funnel-4 text-sm font-semibold text-primary-foreground">
            LT
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background">
      <Sidebar />
      <div className="pl-16">
        <Header title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
