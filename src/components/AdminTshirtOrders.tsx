import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Check, X, Loader2, RefreshCw, Search, Upload, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/components/ui/use-toast';
import { TShirtOrderStatus } from '@/types/tshirt-order';
import { getTShirtOrders, verifyTShirtOrder, cancelTShirtOrder } from '@/utils/tshirtOrderManager';
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';

interface RegistrationData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  participant_location?: string;
  [key: string]: unknown;
}

interface OrderWithRelations {
  id: string;
  registration_id: string;
  size: string;
  quantity: number;
  payment_reference: string;
  status: TShirtOrderStatus;
  created_at: string;
  updated_at: string;
  registrations: RegistrationData | null;
}

interface PaymentReference {
  ref_number: string;
  amount: number;
  phone: string;
  date: string;
}

const statusVariantMap: Record<TShirtOrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline',
  verified: 'secondary',
  cancelled: 'destructive',
};

const statusLabelMap: Record<TShirtOrderStatus, string> = {
  pending: 'Pending',
  verified: 'Verified',
  cancelled: 'Cancelled',
};

export default function AdminTshirtOrders() {
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState<Record<string, boolean>>({});
  const [isCancelling, setIsCancelling] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<TShirtOrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Helper functions to safely access registration data
  const getRegistrantName = (order: OrderWithRelations): string => {
    return order.registrations?.name || 'N/A';
  };

  const getRegistrantPhone = (order: OrderWithRelations): string => {
    return order.registrations?.phone || 'N/A';
  };

  const getRegistrantEmail = (order: OrderWithRelations): string => {
    return order.registrations?.email || 'N/A';
  };
  
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filter by status
      const statusMatch = statusFilter === 'all' || order.status === statusFilter;

      // Filter by search query
      if (!searchQuery) return statusMatch;

      const searchLower = searchQuery.toLowerCase();
      const registration = order.registrations;

      return (
        statusMatch &&
        (order.payment_reference?.toLowerCase().includes(searchLower) ||
          registration?.name?.toLowerCase().includes(searchLower) ||
          registration?.phone?.toLowerCase().includes(searchLower) ||
          registration?.email?.toLowerCase().includes(searchLower))
      );
    });
  }, [orders, statusFilter, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const filters: { status?: TShirtOrderStatus } = {};
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      const { data, error } = await getTShirtOrders(filters);
      
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch T-shirt orders. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);
  
  const handleUpdateStatus = async (orderId: string, newStatus: TShirtOrderStatus) => {
    try {
      // Set loading state
      if (newStatus === 'verified') {
        setIsVerifying((prev) => ({ ...prev, [orderId]: true }));
      } else if (newStatus === 'cancelled') {
        setIsCancelling((prev) => ({ ...prev, [orderId]: true }));
      }
      
      // Call the appropriate API function based on the new status
      let result;
      if (newStatus === 'verified') {
        result = await verifyTShirtOrder(orderId);
      } else if (newStatus === 'cancelled') {
        result = await cancelTShirtOrder(orderId);
      } else {
        throw new Error('Invalid status update');
      }
      
      if (result.error) {
        throw result.error;
      }
      
      if (!result.data) {
        throw new Error('No data returned from server');
      }
      
                      // Update local state with the updated order
      if (result.data) {
        setOrders(prevOrders => {
          const existingOrder = prevOrders.find(o => o.id === orderId);
          if (!existingOrder) return prevOrders;
          
          // Safely extract the updated data
          const updatedData = result.data;
          if (!updatedData) return prevOrders;
          
          // Create a properly typed updated order
          const updatedOrder: OrderWithRelations = {
            ...existingOrder,
            status: updatedData.status || existingOrder.status,
            updated_at: updatedData.updated_at || existingOrder.updated_at,
            registrations: updatedData.registrations || existingOrder.registrations
          };
          
          return prevOrders.map(order => 
            order.id === orderId ? updatedOrder : order
          );
        });
      }
      
      // Show success toast
      toast({
        title: "Success",
        description: `Order has been ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error(`Error updating order status to ${newStatus}:`, error);
      
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update order status. Please try again.',
        variant: "destructive",
      });
    } finally {
      // Reset loading states
      if (newStatus === 'verified') {
        setIsVerifying(prev => ({ ...prev, [orderId]: false }));
      } else if (newStatus === 'cancelled') {
        setIsCancelling(prev => ({ ...prev, [orderId]: false }));
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const result = Papa.parse(text, { header: true });
      
      if (result.errors.length > 0) {
        throw new Error('Invalid CSV format');
      }

      const paymentRefs: PaymentReference[] = result.data.map((row: any) => ({
        ref_number: row.ref_number || row.reference || row.ref,
        amount: parseFloat(row.amount) || 0,
        phone: row.phone,
        date: row.date
      }));

      // Match payment references to orders
      let verifiedCount = 0;
      let duplicateCount = 0;
      let noMatchCount = 0;

      for (const paymentRef of paymentRefs) {
        if (!paymentRef.ref_number) continue;

        // Find orders with matching payment reference
        const matchingOrders = orders.filter(order => 
          order.payment_reference === paymentRef.ref_number && 
          order.status === 'pending'
        );

        if (matchingOrders.length === 1) {
          // Single match - verify the order
          const result = await verifyTShirtOrder(matchingOrders[0].id);
          if (!result.error) {
            verifiedCount++;
          }
        } else if (matchingOrders.length > 1) {
          // Multiple matches - mark as duplicate
          for (const order of matchingOrders) {
            const result = await cancelTShirtOrder(order.id);
            if (!result.error) {
              duplicateCount++;
            }
          }
        } else {
          noMatchCount++;
        }
      }

      // Refresh orders
      await fetchOrders();

      toast({
        title: 'Payment Verification Complete',
        description: `Verified: ${verifiedCount}, Duplicates: ${duplicateCount}, No Match: ${noMatchCount}`,
      });

    } catch (error) {
      console.error('Error processing CSV:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to process CSV file. Please check the format.',
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const exportVerifiedOrders = () => {
    const verifiedOrders = orders.filter(order => order.status === 'verified');
    
    const csvContent = [
      // Headers
      "Order ID,Name,Phone,Size,Quantity,Payment Reference,Date",
      // Data rows
      ...verifiedOrders.map(order => 
        `"${order.id}","${getRegistrantName(order)}","${getRegistrantPhone(order)}","${order.size}","${order.quantity}","${order.payment_reference}","${format(new Date(order.created_at), 'MMM d, yyyy')}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `verified_tshirt_orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  // If no orders found
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p>No T-shirt orders found</p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-2"
          onClick={() => fetchOrders().catch(console.error)}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }
  
  // If no orders match the filter
  if (filteredOrders.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value: TShirtOrderStatus | "all") => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={fetchOrders}
              disabled={isLoading}
              title="Refresh orders"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            {/* CSV Upload for Payment Verification */}
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button
                variant="outline"
                size="sm"
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload Payments
              </Button>
            </div>

            {/* Export Verified Orders */}
            <Button
              variant="outline"
              size="sm"
              onClick={exportVerifiedOrders}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Verified
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border rounded-lg">
          <p>No orders match the current filters</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2"
            onClick={() => {
              setStatusFilter("all");
              setSearchQuery("");
            }}
          >
            Clear filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value: TShirtOrderStatus | "all") => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchOrders}
            disabled={isLoading}
            title="Refresh orders"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          {/* CSV Upload for Payment Verification */}
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload Payments
            </Button>
          </div>

          {/* Export Verified Orders */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportVerifiedOrders}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Verified
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Participant</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    {order.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {getRegistrantName(order)}
                  </TableCell>
                  <TableCell>{getRegistrantPhone(order)}</TableCell>
                  <TableCell>{order.size}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {order.payment_reference || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusVariantMap[order.status]}
                      className={`${order.status === 'verified' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''} ${order.status === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}`}
                    >
                      {statusLabelMap[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => handleUpdateStatus(order.id, 'verified')}
                            disabled={isVerifying[order.id]}
                          >
                            {isVerifying[order.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            disabled={isCancelling[order.id]}
                          >
                            {isCancelling[order.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                          </Button>
                        </>
                      )}
                      {order.status === 'verified' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          disabled={isCancelling[order.id]}
                        >
                          {isCancelling[order.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
