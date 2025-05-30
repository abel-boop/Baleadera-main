
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllRegistrations, updateRegistrationStatus, Registration } from "@/utils/supabaseDataManager";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import AdminSidebar from "@/components/AdminSidebar";
import AdminStatsCards from "@/components/AdminStatsCards";
import AdminRegistrationsTable from "@/components/AdminRegistrationsTable";
import PrintParticipantIds from "@/components/PrintParticipantIds";

const Admin = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("registrations");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [churchFilter, setChurchFilter] = useState("all");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load registrations from Supabase
  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        setLoading(true);
        const data = await getAllRegistrations();
        setRegistrations(data);
      } catch (error: any) {
        console.error('Error loading registrations:', error);
        toast({
          title: "Error Loading Data",
          description: error.message || "Failed to load registrations.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();
  }, [toast]);

  // Get unique values for filters
  const uniqueChurches = [...new Set(registrations.map(r => r.church))];
  const uniqueGrades = [...new Set(registrations.map(r => r.grade))];

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(registration => {
      const matchesSearch = registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          registration.phone.includes(searchTerm) ||
                          registration.church.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || registration.status === statusFilter;
      const matchesGrade = gradeFilter === "all" || registration.grade === gradeFilter;
      const matchesChurch = churchFilter === "all" || registration.church === churchFilter;
      
      return matchesSearch && matchesStatus && matchesGrade && matchesChurch;
    });
  }, [registrations, searchTerm, statusFilter, gradeFilter, churchFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = registrations.length;
    const approved = registrations.filter(r => r.status === 'approved').length;
    const pending = registrations.filter(r => r.status === 'pending').length;
    const rejected = registrations.filter(r => r.status === 'rejected').length;
    
    return { total, approved, pending, rejected };
  }, [registrations]);

  const handleStatusUpdate = async (registrationId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    try {
      await updateRegistrationStatus(registrationId, newStatus);
      
      // Update local state
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: newStatus, participant_id: newStatus === 'approved' ? 'Generated' : undefined }
            : reg
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Registration has been ${newStatus}.`,
      });
      
      // Reload data to get the updated participant_id
      const updatedData = await getAllRegistrations();
      setRegistrations(updatedData);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating the registration status.",
        variant: "destructive"
      });
    }
  };

  const exportData = () => {
    const csvContent = [
      // Headers
      "Name,Phone,Age,Grade,Gender,Church,Status,Participant ID,Registration Date",
      // Data rows
      ...filteredRegistrations.map(reg => 
        `"${reg.name}","${reg.phone}","${reg.age}","${reg.grade}","${reg.gender}","${reg.church}","${reg.status}","${reg.participant_id || ''}","${new Date(reg.created_at).toLocaleDateString()}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `youth_forum_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full text-foreground transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity duration-300" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out">
            <AdminSidebar 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }} 
            />
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40 px-4 sm:px-6 py-3 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-accent/50"
                onClick={() => setSidebarOpen(true)}
                aria-label="Toggle menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent/50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {activeTab === "registrations" && (
            <div className="space-y-6 animate-fade-in [&_.text-muted-foreground]:text-gray-600 dark:[&_.text-muted-foreground]:text-gray-400">
              <AdminStatsCards stats={stats} />
              <AdminRegistrationsTable
                registrations={registrations}
                filteredRegistrations={filteredRegistrations}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                gradeFilter={gradeFilter}
                churchFilter={churchFilter}
                uniqueGrades={uniqueGrades}
                uniqueChurches={uniqueChurches}
                onSearchChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onGradeFilterChange={setGradeFilter}
                onChurchFilterChange={setChurchFilter}
                onStatusUpdate={handleStatusUpdate}
                onExportData={exportData}
              />
            </div>
          )}

          {activeTab === "print-ids" && (
            <div className="animate-fade-in">
              <PrintParticipantIds registrations={registrations} />
            </div>
          )}
          
          {activeTab === "events" && (
            <div className="text-center py-12 animate-fade-in">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Events Management</h3>
              <p className="text-gray-600 dark:text-gray-400">Events management functionality coming soon...</p>
            </div>
          )}
          
          {activeTab === "users" && (
            <div className="text-center py-12 animate-fade-in">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">User Management</h3>
              <p className="text-gray-600 dark:text-gray-400">User management functionality coming soon...</p>
            </div>
          )}
          
          {activeTab === "settings" && (
            <div className="text-center py-12 animate-fade-in">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Settings</h3>
              <p className="text-gray-600 dark:text-gray-400">Settings panel coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
