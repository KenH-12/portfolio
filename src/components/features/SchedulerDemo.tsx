import { Clock, Play, Pause, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tasks = [
  { 
    id: 1, 
    name: "Daily API Health Check", 
    schedule: "Every day at 9:00 AM", 
    status: "running", 
    lastRun: "2 hours ago",
    nextRun: "Tomorrow 9:00 AM"
  },
  { 
    id: 2, 
    name: "Weekly Analytics Report", 
    schedule: "Every Monday at 6:00 AM", 
    status: "completed", 
    lastRun: "3 days ago",
    nextRun: "Monday 6:00 AM"
  },
  { 
    id: 3, 
    name: "Database Backup", 
    schedule: "Every 6 hours", 
    status: "running", 
    lastRun: "4 hours ago",
    nextRun: "In 2 hours"
  },
  { 
    id: 4, 
    name: "Clear Expired Sessions", 
    schedule: "Every hour", 
    status: "paused", 
    lastRun: "1 hour ago",
    nextRun: "—"
  },
  { 
    id: 5, 
    name: "Sync External APIs", 
    schedule: "Every 15 minutes", 
    status: "error", 
    lastRun: "5 minutes ago",
    nextRun: "In 10 minutes"
  },
];

const statusConfig = {
  running: { icon: Play, color: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/30" },
  completed: { icon: CheckCircle2, color: "text-neon-cyan", bg: "bg-neon-cyan/10", border: "border-neon-cyan/30" },
  paused: { icon: Pause, color: "text-muted-foreground", bg: "bg-muted/50", border: "border-muted" },
  error: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
};

export function SchedulerDemo() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Active Tasks" value="12" />
        <StatCard icon={Play} label="Running" value="4" color="text-neon-green" />
        <StatCard icon={Pause} label="Paused" value="2" color="text-muted-foreground" />
        <StatCard icon={AlertCircle} label="Errors" value="1" color="text-destructive" />
      </div>

      {/* Task List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="border-b border-border/50 p-6">
          <h3 className="font-heading text-lg font-semibold text-foreground">Scheduled Tasks</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage your automated workflows</p>
        </div>

        <div className="divide-y divide-border/20">
          {tasks.map((task, index) => {
            const config = statusConfig[task.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;
            
            return (
              <div 
                key={task.id} 
                className="p-6 hover:bg-muted/20 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("rounded-xl p-3", config.bg)}>
                      <StatusIcon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{task.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{task.schedule}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn(config.bg, config.border, config.color)}>
                    {task.status}
                  </Badge>
                </div>
                
                <div className="mt-4 ml-16 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Last run: </span>
                    <span className="text-foreground">{task.lastRun}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next run: </span>
                    <span className="text-foreground">{task.nextRun}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color = "text-primary" 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  color?: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-muted/50 p-2">
          <Icon className={cn("h-4 w-4", color)} />
        </div>
        <div>
          <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
