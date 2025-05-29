
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Printer, Filter, IdCard, QrCode } from "lucide-react";
import { Registration } from "@/utils/supabaseDataManager";

interface PrintParticipantIdsProps {
  registrations: Registration[];
}

const PrintParticipantIds = ({ registrations }: PrintParticipantIdsProps) => {
  const [gradeFilter, setGradeFilter] = useState("all");
  const [churchFilter, setChurchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("approved");

  // Get unique values for filters
  const uniqueGrades = [...new Set(registrations.map(r => r.grade))];
  const uniqueChurches = [...new Set(registrations.map(r => r.church))];

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(registration => {
      const matchesStatus = statusFilter === "all" || registration.status === statusFilter;
      const matchesGrade = gradeFilter === "all" || registration.grade === gradeFilter;
      const matchesChurch = churchFilter === "all" || registration.church === churchFilter;
      
      return matchesStatus && matchesGrade && matchesChurch;
    });
  }, [registrations, statusFilter, gradeFilter, churchFilter]);

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              size: A4;
              margin: 0.5in;
            }
          }
        `}
      </style>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="text-xl text-gray-900">Print Participant IDs</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Generate and print professional IDs for registered participants</p>
            </div>
            <Button 
              onClick={handlePrintAll} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print All IDs
            </Button>
          </div>

          {/* Filter Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Filter className="h-4 w-4 mr-2 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-700">Filter Participants</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Select criteria to filter participants for ID printing.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Grade Level</label>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
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
                <Select value={churchFilter} onValueChange={setChurchFilter}>
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Registration Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Approved Only" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="approved">Approved Only</SelectItem>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-500">{filteredRegistrations.length} participants selected for printing</p>
          </div>

          {/* ID Cards Grid */}
          <div className="print-area grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
            {filteredRegistrations.map((participant) => (
              <div 
                key={participant.id} 
                className="relative w-full h-64 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl overflow-hidden shadow-lg print:shadow-none print:border-2 print:border-gray-300 print:h-56 print:mb-6"
              >
                {/* Header Section */}
                <div className="bg-white px-4 py-3 relative">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
                  <h1 className="text-sm font-bold text-gray-800 text-center leading-tight">
                    ባለአደራ ትውልድ Youth Forum ID
                  </h1>
                </div>

                {/* Main Content */}
                <div className="px-4 py-4 text-white space-y-3">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-blue-100 text-xs">Full Name:</span>
                      <span className="font-semibold text-white text-right flex-1 ml-2 truncate">
                        {participant.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-xs">Age:</span>
                      <span className="font-semibold text-white">{participant.age}</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-blue-100 text-xs">Church:</span>
                      <span className="font-semibold text-white text-right flex-1 ml-2 truncate">
                        {participant.church}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-xs">Forum ID:</span>
                      <span className="font-mono font-bold text-yellow-300 text-sm">
                        {participant.participant_id || 'Pending'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-xs">Emergency Contact:</span>
                      <span className="font-semibold text-white">{participant.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="absolute bottom-0 left-0 right-0 bg-gray-800 px-4 py-2">
                  <div className="flex justify-between items-center text-xs text-gray-300">
                    <div className="flex items-center space-x-1">
                      <span>Location: Hawassa City</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Date: May 21, 2025</span>
                      <QrCode className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge 
                    className={`text-xs ${
                      participant.status === 'approved' 
                        ? 'bg-green-500 text-white' 
                        : participant.status === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-black'
                    }`}
                  >
                    {participant.status}
                  </Badge>
                </div>

                {/* Decorative Element */}
                <div className="absolute top-8 right-0 w-20 h-20 bg-red-500 opacity-20 transform rotate-45 translate-x-10"></div>
              </div>
            ))}
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <IdCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">No participants found</p>
              <p className="text-sm">Try adjusting your filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintParticipantIds;
