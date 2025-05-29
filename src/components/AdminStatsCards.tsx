
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, XCircle } from "lucide-react";

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
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-slate-800/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-900 dark:text-blue-100"
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-50 dark:bg-slate-800/40",
      iconColor: "text-green-600 dark:text-green-400",
      valueColor: "text-green-900 dark:text-green-100"
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "yellow",
      bgColor: "bg-yellow-50 dark:bg-slate-800/40",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      valueColor: "text-yellow-900 dark:text-yellow-100"
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "red",
      bgColor: "bg-red-50 dark:bg-slate-800/40",
      iconColor: "text-red-600 dark:text-red-400",
      valueColor: "text-red-900 dark:text-red-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={card.title} 
            className="border border-border shadow-sm bg-card hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor} transition-transform duration-200 hover:scale-110`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${card.valueColor} transition-all duration-200`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;
