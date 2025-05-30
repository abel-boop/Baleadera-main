
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, XCircle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

const AdminStatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total Registrations",
      value: stats.total,
      icon: Users,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-foreground",
      trend: "+12% from last month"
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      valueColor: "text-foreground",
      trend: "+8% from last month"
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: Clock,
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      valueColor: "text-foreground",
      trend: "3 awaiting review"
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      valueColor: "text-foreground",
      trend: "-2% from last month"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={card.title} 
            className={cn(
              "group relative overflow-hidden border-border/40 bg-card/50 hover:bg-card/80",
              "transition-all duration-300 hover:shadow-md hover:border-border/60",
              "animate-fade-in"
            )}
            style={{ 
              animationDelay: `${index * 100}ms`,
              backdropFilter: 'blur(4px)'
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div 
                className={cn(
                  "p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
                  card.iconBg,
                  card.iconColor
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-semibold mb-1", card.valueColor)}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                {card.trend}
                <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;
