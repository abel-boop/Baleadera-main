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

  const handleCreateEdition = async () => {
    try {
      // Check if an edition for this year already exists
      const existingEdition = editions.find(edition => edition.year === newEdition.year);
      if (existingEdition) {
        toast({
          title: "Error",
          description: `An edition for year ${newEdition.year} already exists`,
          variant: "destructive"
        });
        return;
      }

      console.log('Attempting to create edition with data:', newEdition);
      const result = await createEdition(newEdition);
      console.log('Edition created successfully:', result);
      toast({
        title: "Success",
        description: "New edition created successfully",
      });
      
      // Update the editions list
      onEditionsChange([...editions, result]);
      
      // Reset form
      setNewEdition({
        year: new Date().getFullYear() + 1, // Default to next year when resetting
        name: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        event_location: 'Hawassa'
      });
      setIsCreating(false);
    } catch (error: any) {
      console.error('Error creating edition:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create edition",
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

  const handleDeleteEdition = async (editionId: number) => {
    try {
      await deleteEdition(editionId);
      toast({
        title: "Success",
        description: "Edition deleted successfully",
      });
      
      // Update the editions list
      onEditionsChange(editions.filter(e => e.id !== editionId));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete edition",
        variant: "destructive"
      });
    }
  };

  return (
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
            <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button onClick={handleCreateEdition}>Create Edition</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {editions.map((edition) => (
          <div key={edition.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <div className="truncate">
                  <h3 className="text-sm font-medium truncate">{edition.name}</h3>
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
                onClick={() => handleUpdateStatus(edition.id, !edition.is_active)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                {edition.is_active ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteEdition(edition.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEditions;
