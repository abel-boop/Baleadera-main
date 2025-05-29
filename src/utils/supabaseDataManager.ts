
import { supabase } from "@/integrations/supabase/client";

export interface Registration {
  id: string;
  name: string;
  phone: string;
  age: string;
  grade: string;
  gender: string;
  church: string;
  status: 'pending' | 'approved' | 'rejected';
  participant_id?: string;
  created_at: string;
  updated_at: string;
}

// Get all registrations from Supabase (admin only)
export const getAllRegistrations = async (): Promise<Registration[]> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading registrations:', error);
      throw new Error('Failed to load registrations');
    }
    
    // Type assertion to ensure status is properly typed
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected'
    }));
  } catch (error) {
    console.error('Error loading registrations:', error);
    throw new Error('Failed to load registrations');
  }
};

// Get a single registration by ID
export const getRegistration = async (id: string): Promise<Registration | null> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error loading registration:', error);
      throw new Error('Failed to load registration');
    }
    
    if (!data) return null;
    
    // Type assertion to ensure status is properly typed
    return {
      ...data,
      status: data.status as 'pending' | 'approved' | 'rejected'
    };
  } catch (error) {
    console.error('Error loading registration:', error);
    return null;
  }
};

// Save a new registration (public - no auth required)
export const saveRegistration = async (formData: Omit<Registration, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .insert([{
        name: formData.name,
        phone: formData.phone,
        age: formData.age,
        grade: formData.grade,
        gender: formData.gender,
        church: formData.church,
        status: 'pending'
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Error saving registration:', error);
      throw new Error('Failed to save registration');
    }

    return data.id;
  } catch (error) {
    console.error('Error saving registration:', error);
    throw new Error('Failed to save registration');
  }
};

// Update registration status (admin only)
export const updateRegistrationStatus = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> => {
  try {
    const updateData: any = { status };
    
    // Generate participant ID when approved
    if (status === 'approved') {
      const { data: funcData, error: funcError } = await supabase.rpc('generate_participant_id');
      if (funcError) {
        console.error('Error generating participant ID:', funcError);
      } else {
        updateData.participant_id = funcData;
      }
    }
    
    // Remove participant ID if rejected
    if (status === 'rejected') {
      updateData.participant_id = null;
    }

    const { error } = await supabase
      .from('registrations')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating registration:', error);
      throw new Error('Failed to update registration');
    }
  } catch (error) {
    console.error('Error updating registration:', error);
    throw new Error('Failed to update registration');
  }
};

// Clear all registrations (admin only)
export const clearAllRegistrations = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .neq('id', ''); // Delete all records
    
    if (error) {
      console.error('Error clearing registrations:', error);
      throw new Error('Failed to clear registrations');
    }
  } catch (error) {
    console.error('Error clearing registrations:', error);
    throw new Error('Failed to clear registrations');
  }
};

// Export registrations as JSON (admin only)
export const exportRegistrations = async (): Promise<string> => {
  const registrations = await getAllRegistrations();
  return JSON.stringify(registrations, null, 2);
};
