import { useState } from "react";
import { GraduationCap, Briefcase, Quote, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableDemo } from "./DataTableDemo";
import { AnalyticsDemo } from "./AnalyticsDemo";
import { SchedulerDemo } from "./SchedulerDemo";
import { CommentsDemo } from "./CommentsDemo";

const tabs = [
  { id: "data-table", label: "Experience", icon: Briefcase, component: DataTableDemo },
  { id: "analytics", label: "Education", icon: GraduationCap, component: AnalyticsDemo },
  { id: "comments", label: "Projects", icon: Code, component: CommentsDemo },
  { id: "scheduler", label: "Testimonials", icon: Quote, component: SchedulerDemo },
];

export function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState("data-table");
  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || DataTableDemo;

  return (
    <section id="features" className="py-2">

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-2xl bg-muted/30 p-1.5 border border-border/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        <ActiveComponent />
      </div>
    </section>
  );
}
