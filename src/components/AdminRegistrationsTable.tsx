import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Search, Download, Filter, Users, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Registration } from "@/utils/supabaseDataManager";
import { useRegistrationFilters } from "@/hooks/useRegistrationFilters";
import { cn } from "@/lib/utils";

interface RegistrationsTableProps {
  registrations: Registration[];
  searchTerm: string;
  statusFilter: string;
  gradeFilter: string;
  churchFilter: string;
  locationFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onGradeFilterChange: (value: string) => void;
  onChurchFilterChange: (value: string) => void;
  onLocationFilterChange: (value: string) => void;
  onStatusUpdate: (id: string, status: 'approved' | 'rejected' | 'pending') => void;
  onExportData: () => void;
}

const AdminRegistrationsTable = ({
  registrations,
  searchTerm,
  statusFilter,
  gradeFilter,
  churchFilter,
  locationFilter,
  onSearchChange,
  onStatusFilterChange,
  onGradeFilterChange,
  onChurchFilterChange,
  onLocationFilterChange,
  onStatusUpdate,
  onExportData
}: RegistrationsTableProps) => {
  // Use the custom hook for filtering
  const { 
    filteredRegistrations, 
    uniqueGrades, 
    uniqueLocations, 
    CHURCHES 
  } = useRegistrationFilters(registrations, {
    searchTerm,
    statusFilter,
    gradeFilter,
    churchFilter,
    locationFilter
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [registrationsPerPage] = useState(10);
  
  // Calculate pagination
  const indexOfLastRegistration = currentPage * registrationsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - registrationsPerPage;
  const currentRegistrations = filteredRegistrations.slice(indexOfFirstRegistration, indexOfLastRegistration);
  const totalPages = Math.ceil(filteredRegistrations.length / registrationsPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, gradeFilter, churchFilter]);
  
  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        hover: "hover:bg-green-200/80 dark:hover:bg-green-900/50",
        label: "Approved"
      },
      rejected: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        hover: "hover:bg-red-200/80 dark:hover:bg-red-900/50",
        label: "Rejected"
      },
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        hover: "hover:bg-yellow-200/80 dark:hover:bg-yellow-900/50",
        label: "Pending"
      }
    };
    
    const { bg, text, hover, label } = variants[status as keyof typeof variants] || variants.pending;
    
    return (
      <Badge 
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
          bg,
          text,
          hover
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5"></span>
        {label}
      </Badge>
    );
  };

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">Registration Management</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Oversee and manage all your camp registrations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Export functionality moved to the top of the page */}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="space-y-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 px-3 h-9 text-muted-foreground hover:text-foreground hover:bg-accent/50"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Search & Filter Options</span>
            {showFilters ? (
              <ChevronUp className="ml-1 h-3.5 w-3.5 opacity-70" />
            ) : (
              <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-70" />
            )}
          </Button>

          {showFilters && (
            <div className="bg-accent/30 p-4 rounded-lg space-y-4 border border-border/40 animate-in fade-in-50">
              <p className="text-sm text-muted-foreground">Find and filter registrations using the options below:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Search Participants</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
                    <Input
                      placeholder="Name, phone, or church"
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="h-9 text-sm bg-background/70 border-border/50">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Grade Level</label>
                  <Select value={gradeFilter} onValueChange={onGradeFilterChange}>
                    <SelectTrigger className="h-9 text-sm bg-background/70 border-border/50">
                      <SelectValue placeholder="All Grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      {uniqueGrades.map(grade => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Church</label>
                  <Select value={churchFilter} onValueChange={onChurchFilterChange}>
                    <SelectTrigger className="h-9 text-sm bg-background/70 border-border/50">
                      <SelectValue placeholder="All Churches" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      <SelectItem value="all">All Churches</SelectItem>
                      {CHURCHES.map((church, index) => (
                        <SelectItem key={index} value={church}>
                          {church}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Location</label>
                  <Select value={locationFilter} onValueChange={onLocationFilterChange}>
                    <SelectTrigger className="h-9 text-sm bg-background/70 border-border/50">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {uniqueLocations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Registration Records</h3>
            <p className="text-sm text-muted-foreground">
              {filteredRegistrations.length} {filteredRegistrations.length === 1 ? 'record' : 'records'} found
            </p>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {currentRegistrations.length > 0 ? (
              currentRegistrations.map((registration) => (
                <Card key={registration.id} className="overflow-hidden border-border/40 bg-card/50 hover:bg-accent/20 transition-colors">
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-foreground">{registration.name}</h4>
                      <div className="ml-2">
                        {getStatusBadge(registration.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-foreground">{registration.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Age</p>
                        <p className="text-foreground">{registration.age}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Grade</p>
                        <p className="text-foreground">{registration.grade}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Gender</p>
                        <p className="text-foreground">{registration.gender}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Church</p>
                      <p className="text-foreground">{registration.church}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-foreground">{registration.participant_location || '-'}</p>
                    </div>
                    
                    {registration.participant_id && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Participant ID</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {registration.participant_id}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      {registration.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onStatusUpdate(registration.id, 'approved')}
                          className="flex-1 gap-1 text-green-700 hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-900/30"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </Button>
                      )}
                      {registration.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onStatusUpdate(registration.id, 'rejected')}
                          className="flex-1 gap-1 text-red-700 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <h4 className="text-lg font-medium text-foreground">No registrations found</h4>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="rounded-lg border border-border/40 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-accent/30 border-b border-border/40">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Participant</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Age</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Grade</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Church</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {currentRegistrations.length > 0 ? (
                    currentRegistrations.map((registration) => (
                      <tr 
                        key={registration.id} 
                        className="bg-card/50 hover:bg-accent/20 transition-colors"
                      >
                        <td className="py-4 px-4 text-sm font-medium text-foreground">
                          {registration.name}
                        </td>
                        <td className="py-4 px-4 text-sm text-foreground/80">
                          {registration.phone}
                        </td>
                        <td className="py-4 px-4 text-sm text-foreground/80">
                          {registration.age}
                        </td>
                        <td className="py-4 px-4 text-sm text-foreground/80">
                          {registration.grade}
                        </td>
                        <td className="py-4 px-4 text-sm text-foreground/80">
                          {registration.church}
                        </td>
                        <td className="py-4 px-4 text-sm text-foreground/80">
                          {registration.participant_location || '-'}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(registration.status)}
                        </td>
                        <td className="py-4 px-4">
                          {registration.participant_id ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary">
                              {registration.participant_id}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            {registration.status !== 'approved' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onStatusUpdate(registration.id, 'approved')}
                                className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-900/30"
                              >
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                            )}
                            {registration.status !== 'rejected' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onStatusUpdate(registration.id, 'rejected')}
                                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="h-12 w-12 text-muted-foreground/40 mb-3" />
                          <h4 className="text-lg font-medium text-foreground">No registrations found</h4>
                          <p className="text-sm text-muted-foreground mt-1 max-w-md">
                            Try adjusting your search or filter criteria to find what you're looking for.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination - Only show if there are registrations */}
          {filteredRegistrations.length > 0 && (
            <div className="flex items-center justify-between px-1 pt-2">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{indexOfFirstRegistration + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(registrationsPerPage * currentPage, filteredRegistrations.length)}
                </span>{' '}
                of <span className="font-medium">{filteredRegistrations.length}</span> registrations
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <div className="flex items-center justify-center text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || filteredRegistrations.length === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRegistrationsTable;
