import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllRegistrations, 
  updateRegistrationStatus, 
  createEdition,
  updateEditionStatus,
  deleteEdition,
  Registration,
  getActiveEdition,
  getAllEditions,
  Edition
} from "@/utils/supabaseDataManager";
import { CHURCHES } from "@/constants/churches";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import AdminSidebar from "@/components/AdminSidebar";
import AdminStatsCards from "@/components/AdminStatsCards";
import AdminRegistrationsTable from "@/components/AdminRegistrationsTable";
import PrintParticipantIds from "@/components/PrintParticipantIds";
import AdminEditions from "@/components/AdminEditions";
import AdminTshirtOrders from "@/components/AdminTshirtOrders";
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AdminTab } from "@/components/AdminSidebar";

const Admin = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>("registrations");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [churchFilter, setChurchFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedEdition, setSelectedEdition] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [loadingEditions, setLoadingEditions] = useState(true);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  
  // Load editions and registrations from Supabase
  useEffect(() => {
    const loadEditions = async () => {
      try {
        setLoadingEditions(true);
        const [activeEdition, allEditions] = await Promise.all([
          getActiveEdition(),
          getAllEditions()
        ]);
        
        setEditions(allEditions);
        
        // Set the active edition as default if available
        if (activeEdition) {
          setSelectedEdition(activeEdition.id);
        } else if (allEditions.length > 0) {
          // If no active edition, select the most recent one
          const sortedEditions = [...allEditions].sort((a, b) => 
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
          );
          setSelectedEdition(sortedEditions[0].id);
        }
      } catch (error: any) {
        console.error('Error loading editions:', error);
        toast({
          title: "Error Loading Editions",
          description: error.message || "Failed to load editions.",
          variant: "destructive"
        });
      } finally {
        setLoadingEditions(false);
      }
    };

    loadEditions();
  }, [toast]);

  // Load registrations based on selected edition
  useEffect(() => {
    const loadRegistrations = async () => {
      if (loadingEditions) return; // Wait for editions to load first
      
      try {
        setLoading(true);
        const data = await getAllRegistrations();
        
        // If a specific edition is selected, filter registrations
        const filteredData = selectedEdition === 'all' 
          ? data 
          : data.filter(reg => reg.edition_id === selectedEdition);
          
        setRegistrations(filteredData);
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
  }, [selectedEdition, loadingEditions, toast]);

  // Get unique values for filters
  const uniqueGrades = useMemo(() => [...new Set(registrations.map(r => r.grade))], [registrations]);
  
  const uniqueLocations = useMemo(() => [
    'Hawassa',
    'Addis Ababa',
    ...registrations
      .map(r => r.participant_location)
      .filter((location): location is 'Hawassa' | 'Addis Ababa' => 
        location === 'Hawassa' || location === 'Addis Ababa'
      )
  ].filter((value, index, self) => self.indexOf(value) === index), [registrations]);

  // Get the current edition being viewed
  const currentEdition = useMemo(() => {
    if (selectedEdition === 'all') return null;
    return editions.find(e => e.id === selectedEdition);
  }, [selectedEdition, editions]);

  // Handle edition change
  const handleEditionChange = (value: string) => {
    setSelectedEdition(value === 'all' ? 'all' : parseInt(value, 10));
  };

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
      
      // Update local state immediately for better UX
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { 
                ...reg, 
                status: newStatus, 
                participant_id: newStatus === 'approved' ? 'Generated' : reg.participant_id 
              }
            : reg
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Registration has been ${newStatus}.`,
      });
      
      // Reload data to ensure we have the latest state, but maintain the current edition filter
      const allRegistrations = await getAllRegistrations();
      const filteredData = selectedEdition === 'all' 
        ? allRegistrations 
        : allRegistrations.filter(reg => reg.edition_id === selectedEdition);
        
      setRegistrations(filteredData);
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
    // Apply the same filters as in the UI
    const filteredData = registrations.filter(registration => {
      const matchesSearch = registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        registration.phone.includes(searchTerm) ||
                        registration.church?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        registration.participant_location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || registration.status === statusFilter;
      const matchesGrade = gradeFilter === "all" || registration.grade === gradeFilter;
      const matchesChurch = churchFilter === "all" || registration.church === churchFilter;
      const matchesLocation = locationFilter === "all" || registration.participant_location === locationFilter;
      
      return matchesSearch && matchesStatus && matchesGrade && matchesChurch && matchesLocation;
    });

    const csvContent = [
      // Headers
      "Name,Phone,Age,Grade,Gender,Church,Location,Status,Participant ID,Registration Date",
      // Data rows
      ...filteredData.map(reg => 
        `"${reg.name}","${reg.phone}","${reg.age}","${reg.grade}","${reg.gender}","${reg.church}","${reg.participant_location || ''}","${reg.status}","${reg.participant_id || ''}","${new Date(reg.created_at).toLocaleDateString()}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `youth_camp_registrations_${new Date().toISOString().split('T')[0]}.csv`);
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
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold">
                      {currentEdition ? currentEdition.name : 'All Editions'}
                    </h2>
                    {currentEdition && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(currentEdition.start_date).toLocaleDateString()} - {new Date(currentEdition.end_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={exportData} variant="outline" size="sm">
                      Export CSV
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-64">
                    <Label htmlFor="edition-select" className="text-xs text-muted-foreground mb-1 block">
                      Select Edition
                    </Label>
                    <Select
                      value={selectedEdition === 'all' ? 'all' : selectedEdition.toString()}
                      onValueChange={handleEditionChange}
                      disabled={loadingEditions}
                    >
                      <SelectTrigger id="edition-select" className="h-9">
                        <SelectValue placeholder="Select edition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Editions</SelectItem>
                        {editions.map((edition) => (
                          <SelectItem 
                            key={edition.id} 
                            value={edition.id.toString()}
                            className={edition.is_active ? 'font-medium' : ''}
                          >
                            {edition.name} {edition.is_active && '(Active)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <AdminRegistrationsTable
                  registrations={registrations}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  gradeFilter={gradeFilter}
                  churchFilter={churchFilter}
                  locationFilter={locationFilter}
                  onSearchChange={setSearchTerm}
                  onStatusFilterChange={setStatusFilter}
                  onGradeFilterChange={setGradeFilter}
                  onChurchFilterChange={setChurchFilter}
                  onLocationFilterChange={setLocationFilter}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            </div>
          )}

          {activeTab === "tshirt-orders" && (
            <div className="animate-fade-in">
              <AdminTshirtOrders />
            </div>
          )}

          {activeTab === "print-ids" && (
            <div className="animate-fade-in">
              <PrintParticipantIds 
                registrations={registrations} 
                locationFilter={locationFilter}
              />
            </div>
          )}

          {activeTab === "events" && (
            <div className="animate-fade-in">
              <AdminEditions
                editions={editions}
                onEditionsChange={(newEditions) => setEditions(newEditions)}
                supabase={supabase}
              />
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
