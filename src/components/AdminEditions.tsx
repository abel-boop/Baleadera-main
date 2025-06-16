import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  createEdition, 
  updateEditionStatus, 
  deleteEdition,
  Edition
} from "@/utils/supabaseDataManager";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "./ui/confirmation-dialog";
import { supabase } from '@/integrations/supabase/client';

interface AdminEditionsProps {
  editions: Edition[];
  onEditionsChange: (editions: Edition[]) => void;
  supabase: typeof supabase;
}

const AdminEditions = ({ editions, onEditionsChange, supabase }: AdminEditionsProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newEdition, setNewEdition] = useState({
    year: new Date().getFullYear(),
    name: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    event_location: 'Hawassa'
  });
  const [editingEdition, setEditingEdition] = useState<Edition | null>(null);
  const [deletingEdition, setDeletingEdition] = useState<Edition | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteRegistrationsDialog, setShowDeleteRegistrationsDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateEdition = async () => {
    try {
      // Check if we're editing an existing edition
      if (editingEdition) {
        // Update existing edition
        const { data, error } = await supabase
          .from('editions')
          .update({
            name: newEdition.name,
            year: newEdition.year,
            start_date: newEdition.start_date,
            end_date: newEdition.end_date,
            event_location: newEdition.event_location
          })
          .eq('id', editingEdition.id)
          .select('*')
          .single();

        if (error) throw error;
        
        // Update the editions list
        onEditionsChange(editions.map(e => e.id === editingEdition.id ? data : e));
        
        toast({
          title: "Success",
          description: "Edition updated successfully",
        });
        
        // Reset form and editing state
        setEditingEdition(null);
      } else {
        // Check if an edition for this year already exists
        const existingEdition = editions.find(edition => edition.year === newEdition.year);
        if (existingEdition) {
          throw new Error(`An edition for year ${newEdition.year} already exists`);
        }

        console.log('Attempting to create edition with data:', newEdition);
        const result = await createEdition(newEdition);
        console.log('Edition created successfully:', result);
        
        // Update the editions list
        onEditionsChange([...editions, result]);
        
        toast({
          title: "Success",
          description: "New edition created successfully",
        });
      }
      
      // Reset form
      setNewEdition({
        year: new Date().getFullYear() + 1,
        name: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        event_location: 'Hawassa'
      });
      setIsCreating(false);
    } catch (error: any) {
      console.error('Error saving edition:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save edition",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (editionId: number, isActive: boolean) => {
    try {
      console.log('Attempting to update edition status with id:', editionId, 'and status:', isActive);
      await updateEditionStatus(editionId, isActive);
      console.log('Edition status updated successfully');
      toast({
        title: "Success",
        description: `Edition status updated successfully`,
      });
       
      // Refresh the editions list from the database
      const { data, error } = await supabase
        .from('editions')
        .select('*');

      if (error) {
        console.error('Error fetching updated editions:', error);
        throw new Error('Failed to fetch updated editions');
      }

      console.log('Refreshed editions:', data);
      onEditionsChange(data || []);
    } catch (error: any) {
      console.error('Error updating edition status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update edition status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClick = (edition: Edition) => {
    setDeletingEdition(edition);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async (deleteRegistrations = false) => {
    if (!deletingEdition) return;
    
    setIsProcessing(true);
    setShowDeleteDialog(false);
    setShowDeleteRegistrationsDialog(false);
    
    try {
      if (deleteRegistrations) {
        // Delete all registrations for this edition first
        const { error: deleteError } = await supabase
          .from('registrations')
          .delete()
          .eq('edition_id', deletingEdition.id);
          
        if (deleteError) throw deleteError;
        
        toast({
          title: "Success",
          description: "Registrations deleted successfully",
        });
      }
      
      // Now delete the edition
      const { error } = await supabase
        .from('editions')
        .delete()
        .eq('id', deletingEdition.id);
        
      if (error) throw error;
      
      // Update the editions list
      onEditionsChange(editions.filter(e => e.id !== deletingEdition.id));
      
      toast({
        title: "Success",
        description: "Edition deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting edition:', error);
      
      if (error.message.includes('violates foreign key constraint')) {
        // Show dialog to delete registrations first
        setShowDeleteRegistrationsDialog(true);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to delete edition",
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessing(false);
      if (!showDeleteRegistrationsDialog) {
        setDeletingEdition(null);
      }
    }
  };
  
  const startEditing = (edition: Edition) => {
    setNewEdition({
      year: edition.year,
      name: edition.name,
      start_date: edition.start_date.split('T')[0],
      end_date: edition.end_date.split('T')[0],
      event_location: edition.event_location
    });
    setEditingEdition(edition);
    setIsCreating(true);
  };
  
  const cancelEditing = () => {
    setNewEdition({
      year: new Date().getFullYear(),
      name: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      event_location: 'Hawassa'
    });
    setEditingEdition(null);
    setIsCreating(false);
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingEdition(null);
        }}
        onConfirm={() => confirmDelete(false)}
        title="Delete Edition"
        description="Are you sure you want to delete this edition? This action cannot be undone."
        confirmText="Delete Edition"
        variant="destructive"
      />
      
      {/* Delete with Registrations Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteRegistrationsDialog}
        onClose={() => {
          setShowDeleteRegistrationsDialog(false);
          setDeletingEdition(null);
        }}
        onConfirm={() => confirmDelete(true)}
        title="Delete Edition with Registrations"
        description={
          <>
            <p>This edition has existing registrations. Deleting it will also remove all associated registration data.</p>
            <p className="mt-2 font-medium">Are you sure you want to continue?</p>
          </>
        }
        confirmText="Delete All"
        variant="destructive"
      />
      
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Edition Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Edition
        </Button>
      </div>

      {isCreating && (
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <div className="space-y-2">
            <Label>Year</Label>
            <Input
              type="number"
              value={newEdition.year}
              onChange={(e) => setNewEdition({ ...newEdition, year: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={newEdition.name}
              onChange={(e) => setNewEdition({ ...newEdition, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={newEdition.start_date}
              onChange={(e) => setNewEdition({ ...newEdition, start_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={newEdition.end_date}
              onChange={(e) => setNewEdition({ ...newEdition, end_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Event Location</Label>
            <Select value={newEdition.event_location} onValueChange={(value) => setNewEdition({ ...newEdition, event_location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hawassa">Hawassa</SelectItem>
                <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
            <Button onClick={handleCreateEdition}>
              {editingEdition ? 'Update Edition' : 'Create Edition'}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {editions.map((edition) => (
          <div key={edition.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <div className="truncate">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium truncate">{edition.name}</h3>
                    <span className="text-sm text-muted-foreground">({edition.year})</span>
                    {edition.is_active && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(edition.start_date).toLocaleDateString()} - {new Date(edition.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2 text-xs">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  edition.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {edition.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                  {edition.event_location}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(edition);
                }}
                title="Edit"
                className="text-blue-600 hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus(edition.id, !edition.is_active)}
                title={edition.is_active ? 'Deactivate' : 'Activate'}
                className={edition.is_active ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}
              >
                {edition.is_active ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(edition);
                }}
                title="Delete"
                className="text-red-600 hover:bg-red-50"
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AdminEditions;
