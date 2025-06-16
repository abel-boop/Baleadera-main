
import { Users, Calendar, Settings, LogOut, BarChart3, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const AdminSidebar = ({ activeTab, onTabChange, className }: AdminSidebarProps) => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Sign Out Error",
        description: error.message || "Error signing out.",
        variant: "destructive"
      });
    }
  };

  const menuItems = [
    { id: "registrations", label: "Registrations", icon: Users },
    { id: "print-ids", label: "Print Participant IDs", icon: CreditCard },
    { id: "events", label: "Events", icon: Calendar },
    { id: "users", label: "Users", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={cn(
      "w-64 h-full flex flex-col bg-card border-r border-border/40 transition-colors duration-200",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-red-600 rounded-lg flex items-center justify-center shadow-md">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Youth Camp Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                "hover:bg-accent/50 hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card",
                isActive 
                  ? 'bg-accent text-accent-foreground font-medium' 
                  : 'text-muted-foreground',
                "group"
              )}
            >
              <Icon 
                className={cn(
                  "h-4 w-4 mr-3 transition-transform duration-200",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} 
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/40 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors duration-200"
        >
          <div className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sign out</span>
          </div>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>Q
          </kbd>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
