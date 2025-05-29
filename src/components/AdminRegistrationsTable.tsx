
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Search, Download, Filter, Users } from "lucide-react";
import { Registration } from "@/utils/supabaseDataManager";

interface RegistrationsTableProps {
  registrations: Registration[];
  filteredRegistrations: Registration[];
  searchTerm: string;
  statusFilter: string;
  gradeFilter: string;
  churchFilter: string;
  uniqueGrades: string[];
  uniqueChurches: string[];
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onGradeFilterChange: (value: string) => void;
  onChurchFilterChange: (value: string) => void;
  onStatusUpdate: (id: string, status: 'approved' | 'rejected' | 'pending') => void;
  onExportData: () => void;
}

const AdminRegistrationsTable = ({
  registrations,
  filteredRegistrations,
  searchTerm,
  statusFilter,
  gradeFilter,
  churchFilter,
  uniqueGrades,
  uniqueChurches,
  onSearchChange,
  onStatusFilterChange,
  onGradeFilterChange,
  onChurchFilterChange,
  onStatusUpdate,
  onExportData
}: RegistrationsTableProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <CardTitle className="text-xl text-gray-900">Registration Management</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Oversee and manage all your forum registrations</p>
          </div>
          <Button 
            onClick={onExportData} 
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Search & Filter Options
            </Button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <p className="text-sm text-gray-600">Find and filter registrations using the options below:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Search Registrations</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Name, phone, or church"
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Registration Status</label>
                  <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Grade Level</label>
                  <Select value={gradeFilter} onValueChange={onGradeFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Grades" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Grades</SelectItem>
                      {uniqueGrades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Church Affiliation</label>
                  <Select value={churchFilter} onValueChange={onChurchFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Churches" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Churches</SelectItem>
                      {uniqueChurches.map(church => (
                        <SelectItem key={church} value={church}>{church}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Registration Records</h3>
            <p className="text-sm text-gray-500">{filteredRegistrations.length} records</p>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredRegistrations.map((registration) => (
              <Card key={registration.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{registration.name}</h4>
                    {getStatusBadge(registration.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Phone:</span> {registration.phone}
                    </div>
                    <div>
                      <span className="font-medium">Age:</span> {registration.age}
                    </div>
                    <div>
                      <span className="font-medium">Grade:</span> {registration.grade}
                    </div>
                    <div>
                      <span className="font-medium">Gender:</span> {registration.gender}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Church:</span> {registration.church}
                  </div>
                  
                  {registration.participant_id && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">ID:</span>
                      <span className="ml-2 font-mono text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {registration.participant_id}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    {registration.status !== 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => onStatusUpdate(registration.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    )}
                    {registration.status !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onStatusUpdate(registration.id, 'rejected')}
                        className="flex-1"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Participant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Age</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Grade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Church</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Participant ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((registration) => (
                  <tr key={registration.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{registration.name}</td>
                    <td className="py-4 px-4 text-gray-600">{registration.phone}</td>
                    <td className="py-4 px-4 text-gray-600">{registration.age}</td>
                    <td className="py-4 px-4 text-gray-600">{registration.grade}</td>
                    <td className="py-4 px-4 text-gray-600">{registration.church}</td>
                    <td className="py-4 px-4">{getStatusBadge(registration.status)}</td>
                    <td className="py-4 px-4">
                      {registration.participant_id ? (
                        <span className="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {registration.participant_id}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-1">
                        {registration.status !== 'approved' && (
                          <Button
                            size="sm"
                            onClick={() => onStatusUpdate(registration.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 h-8"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        {registration.status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onStatusUpdate(registration.id, 'rejected')}
                            className="px-3 py-1 h-8"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">No registrations found</p>
              <p className="text-sm">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRegistrationsTable;
