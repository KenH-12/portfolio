import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const areaData = [
  { name: "Mon", requests: 4000, errors: 240 },
  { name: "Tue", requests: 3000, errors: 139 },
  { name: "Wed", requests: 5000, errors: 380 },
  { name: "Thu", requests: 4780, errors: 290 },
  { name: "Fri", requests: 5890, errors: 180 },
  { name: "Sat", requests: 4390, errors: 220 },
  { name: "Sun", requests: 3490, errors: 150 },
];

const barData = [
  { name: "200", count: 8420, color: "hsl(150, 70%, 50%)" },
  { name: "201", count: 3200, color: "hsl(174, 72%, 56%)" },
  { name: "304", count: 1800, color: "hsl(200, 80%, 50%)" },
  { name: "400", count: 420, color: "hsl(45, 100%, 50%)" },
  { name: "500", count: 89, color: "hsl(0, 84%, 60%)" },
];

const metrics = [
  { label: "Total Requests", value: "1.2M", change: "+12.5%" },
  { label: "Avg Latency", value: "89ms", change: "-8.2%" },
  { label: "Error Rate", value: "0.3%", change: "-2.1%" },
  { label: "Uptime", value: "99.99%", change: "+0.01%" },
];

export function AnalyticsDemo() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={metric.label} 
            className="glass-card rounded-2xl p-5"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-heading font-bold text-foreground">{metric.value}</span>
              <span className={`text-xs font-medium ${metric.change.startsWith("+") ? "text-neon-green" : metric.change.startsWith("-") && metric.label !== "Avg Latency" && metric.label !== "Error Rate" ? "text-destructive" : "text-neon-green"}`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Request Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(222, 47%, 8%)", 
                    border: "1px solid hsl(222, 30%, 18%)",
                    borderRadius: "12px",
                    color: "hsl(210, 40%, 98%)"
                  }} 
                />
                <Area type="monotone" dataKey="requests" stroke="hsl(174, 72%, 56%)" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={2} />
                <Area type="monotone" dataKey="errors" stroke="hsl(0, 84%, 60%)" fillOpacity={1} fill="url(#colorErrors)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Status Codes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" horizontal={false} />
                <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(222, 47%, 8%)", 
                    border: "1px solid hsl(222, 30%, 18%)",
                    borderRadius: "12px",
                    color: "hsl(210, 40%, 98%)"
                  }} 
                />
                <Bar dataKey="count" fill="hsl(174, 72%, 56%)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
