import { useMemo, useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Search, Printer, Download, Filter, X, IdCard, ChevronUp, ChevronDown } from 'lucide-react';
import type { Registration } from '@/utils/supabaseDataManager';
import { ParticipantIdCard } from './ParticipantIdCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PrintParticipantIdsProps = {
  registrations: Registration[];
};

export const PrintParticipantIds = ({ registrations }: PrintParticipantIdsProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  const [gradeFilter, setGradeFilter] = useState("all");
  const [churchFilter, setChurchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("approved");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const uniqueGrades = [...new Set(registrations.map(r => r.grade))];
  const uniqueChurches = [...new Set(registrations.map(r => r.church))];

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(registration => {
      const matchesStatus = statusFilter === "all" || registration.status === statusFilter;
      const matchesGrade = gradeFilter === "all" || registration.grade === gradeFilter;
      const matchesChurch = churchFilter === "all" || registration.church === churchFilter;
      const matchesSearch = searchTerm === "" || 
        registration.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.phone?.includes(searchTerm) ||
        registration.church?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesGrade && matchesChurch && matchesSearch;
    });
  }, [registrations, statusFilter, gradeFilter, churchFilter, searchTerm]);

  const handlePrint = async () => {
    // Create a hidden iframe instead of a new window
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const printContent = printRef.current?.innerHTML || '';
    
    // Get the current styles from the document
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          if (sheet.href) {
            return `@import url('${sheet.href}');`;
          }
          return Array.from(sheet.cssRules || []).map(rule => rule.cssText).join('\n');
        } catch (e) {
          console.warn('Could not load styles from', sheet.href, e);
          return '';
        }
      })
      .join('\n');

    // Create a print document
    const printDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!printDocument) return;
    
    printDocument.open();
    printDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print ID Cards</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <base href="${window.location.origin}" />
          <style>
            ${styles}
            
            @page {
              size: A4 landscape;
              margin: 0.5cm;
            }
            
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background: white;
              font-family: system-ui, -apple-system, sans-serif;
            }
            
            .print-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 1cm;
              padding: 1cm;
              width: 100%;
              box-sizing: border-box;
            }
            
            .print-item {
              break-inside: avoid;
              page-break-inside: avoid;
              width: 100%;
              height: 3.5in;
              position: relative;
              overflow: hidden;
            }
            
            /* Ensure all elements are visible */
            .print-item * {
              visibility: visible !important;
            }
            
            /* Force print colors */
            .bg-blue-600, .bg-blue-700, .bg-blue-800, .bg-blue-900,
            .bg-yellow-500, .bg-red-500, .bg-white, .bg-gray-800,
            .bg-white\/10, .bg-yellow-500\/20, .bg-red-500\/20,
            .from-blue-600, .via-blue-700, .to-blue-800,
            .from-blue-700, .to-blue-900,
            .bg-gradient-to-br, .bg-gradient-to-r,
            .bg-gray-800 {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* Fix for footer */
            .print-item > div {
              display: flex !important;
              flex-direction: column !important;
              height: 100% !important;
            }
            
            /* Ensure text colors are preserved */
            .text-white {
              color: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .text-blue-100 {
              color: #dbeafe !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .text-yellow-100 {
              color: #fef9c3 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .text-yellow-300 {
              color: #fde047 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .text-gray-300 {
              color: #d1d5db !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .text-red-100 {
              color: #fee2e2 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .text-yellow-400 {
              color: #facc15 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            @media print {
              @page {
                size: A4 landscape;
                margin: 0.5cm;
              }
              
              body {
                padding: 0 !important;
                margin: 0 !important;
              }
              
              .print-grid {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 0.8cm !important;
                padding: 0.5cm !important;
                margin: 0 !important;
                width: 100% !important;
              }
              
              .print-item {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
                margin-bottom: 0.8cm !important;
                height: 3.5in !important;
              }
              
              /* Ensure all content is visible */
              .print-item > * {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                color: inherit !important;
              }
              
              /* Fix text colors in print */
              .text-white {
                color: #ffffff !important;
              }
              .text-blue-100 {
                color: #dbeafe !important;
              }
              .text-yellow-300 {
                color: #fde047 !important;
              }
              .text-gray-300 {
                color: #d1d5db !important;
              }
              
              /* Fix for flex containers */
              .flex {
                display: flex !important;
              }
              
              /* Ensure proper spacing */
              .mt-auto {
                margin-top: auto !important;
              }
            }
          </style>
        </head>
        <body class="bg-white">
          <div class="print-grid">
            ${printContent}
          </div>
          <script>
            // Wait for all resources to load
            window.addEventListener('load', function() {
              // Small delay to ensure all styles are applied
              setTimeout(function() {
                window.print();
                // Close the window after printing
                window.onafterprint = function() {
                  setTimeout(function() {
                    window.close();
                  }, 100);
                };
              }, 500);
            });
          </script>
        </body>
      </html>
    `);
    
    printDocument.close();
    
    // Clean up the iframe after printing
    const cleanup = () => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    };
    
    // Handle print dialog close/cancel
    if (iframe.contentWindow) {
      iframe.contentWindow.onafterprint = cleanup;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">Print Participant IDs</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Generate and print professional IDs for registered participants
              </CardDescription>
            </div>
            <Button 
              onClick={handlePrint} 
              variant="outline"
              size="sm"
              className="gap-1.5 text-foreground/80 hover:text-foreground hover:bg-accent/50"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print All</span>
            </Button>
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
                <Input
                  placeholder="Search name, phone, or church..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-sm bg-background/70 border-border/50"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 px-3 h-9 text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
                {showFilters ? (
                  <ChevronUp className="ml-1 h-3.5 w-3.5 opacity-70" />
                ) : (
                  <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-70" />
                )}
              </Button>
            </div>

            {showFilters && (
              <div className="bg-accent/30 p-4 rounded-lg space-y-4 border border-border/40 animate-in fade-in-50">
                <p className="text-sm text-muted-foreground">Filter participants by the following criteria:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Grade Level</label>
                    <Select value={gradeFilter} onValueChange={setGradeFilter}>
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
                    <Select value={churchFilter} onValueChange={setChurchFilter}>
                      <SelectTrigger className="h-9 text-sm bg-background/70 border-border/50">
                        <SelectValue placeholder="All Churches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Churches</SelectItem>
                        {uniqueChurches.map(church => (
                          <SelectItem key={church} value={church}>
                            {church}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-9 text-sm bg-background/70 border-border/50">
                        <SelectValue placeholder="Approved Only" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved Only</SelectItem>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Participant ID Cards</h3>
            <p className="text-sm text-muted-foreground">
              {filteredRegistrations.length} {filteredRegistrations.length === 1 ? 'card' : 'cards'} to print
            </p>
          </div>

          {/* ID Cards Grid - Screen View */}
          {filteredRegistrations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRegistrations.map((participant) => (
                <div key={participant.id} className="transition-transform hover:scale-[1.02] hover:shadow-lg">
                  <ParticipantIdCard participant={participant} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IdCard className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <h4 className="text-lg font-medium text-foreground">No participants found</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          )}

          {/* Hidden Print View */}
          <div className="hidden">
            <div ref={printRef} className="print-grid">
              {filteredRegistrations.map((participant) => (
                <div key={`print-${participant.id}`} className="print-item">
                  <ParticipantIdCard participant={participant} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintParticipantIds;
