import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";

const data = [
  { id: 1, endpoint: "/api/users", method: "GET", status: 200, latency: "45ms", requests: "12.4K", trend: "up" },
  { id: 2, endpoint: "/api/auth/login", method: "POST", status: 200, latency: "123ms", requests: "8.2K", trend: "up" },
  { id: 3, endpoint: "/api/products", method: "GET", status: 200, latency: "67ms", requests: "6.1K", trend: "down" },
  { id: 4, endpoint: "/api/orders", method: "POST", status: 201, latency: "89ms", requests: "4.5K", trend: "up" },
  { id: 5, endpoint: "/api/analytics", method: "GET", status: 200, latency: "234ms", requests: "3.2K", trend: "down" },
];

export function DataTableDemo() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
      <div className="border-b border-border/50 p-6">
        <h3 className="font-heading text-lg font-semibold text-foreground">API Endpoints</h3>
        <p className="text-sm text-muted-foreground mt-1">Real-time monitoring of your API traffic</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30">
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Endpoint</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Method</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Latency</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Requests</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {data.map((row, index) => (
              <tr 
                key={row.id} 
                className="transition-colors hover:bg-muted/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <td className="px-6 py-4">
                  <code className="rounded-lg bg-muted/50 px-2 py-1 text-sm font-mono text-foreground">
                    {row.endpoint}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    variant="outline" 
                    className={
                      row.method === "GET" 
                        ? "border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10" 
                        : "border-neon-purple/50 text-neon-purple bg-neon-purple/10"
                    }
                  >
                    {row.method}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                    {row.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{row.latency}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{row.requests}</span>
                    {row.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-neon-green" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
