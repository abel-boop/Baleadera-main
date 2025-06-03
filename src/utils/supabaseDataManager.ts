
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export interface Edition {
  id: number;
  year: number;
  name: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  event_location: string;
  created_at: string;
}

// Define the shape of a registration in our application
export interface Registration {
  id: string;
  name: string;
  phone: string;
  age: string;
  grade: string;
  gender: string;
  church: string;
  participant_location: 'Hawassa' | 'Addis Ababa';
  status: 'pending' | 'approved' | 'rejected';
  edition_id: number;
  participant_id: string | null;
  created_at: string;
  updated_at: string;
}

// Define the shape of the data needed to create a new registration
export type RegistrationInsert = {
  name: string;
  phone: string;
  age: string;
  grade: string;
  gender: string;
  church: string;
  participant_location: 'Hawassa' | 'Addis Ababa';
  edition_id: number;
};

// Get all registrations from Supabase (admin only)
export const getAllRegistrations = async (editionId?: number): Promise<Registration[]> => {
  try {
    let query = supabase
      .from('registrations')
      .select('*');
      
    if (editionId) {
      query = query.eq('edition_id', editionId);
    }
    
    const orderedQuery = query.order('created_at', { ascending: false });
    
    const { data, error } = await orderedQuery;
    
    if (error) {
      console.error('Error loading registrations:', error);
      throw new Error('Failed to load registrations');
    }
    
    // Map the database response to our Registration type
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      age: item.age,
      grade: item.grade,
      gender: item.gender,
      church: item.church,
      participant_location: item.participant_location as 'Hawassa' | 'Addis Ababa',
      status: (item.status || 'pending') as 'pending' | 'approved' | 'rejected',
      edition_id: item.edition_id || 0,
      participant_id: item.participant_id || null,
      created_at: item.created_at,
      updated_at: item.updated_at
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
    
    // Map the database response to our Registration type
    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      age: data.age,
      grade: data.grade,
      gender: data.gender,
      church: data.church,
      participant_location: data.participant_location as 'Hawassa' | 'Addis Ababa',
      status: (data.status || 'pending') as 'pending' | 'approved' | 'rejected',
      edition_id: data.edition_id || 0,
      participant_id: data.participant_id || null,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error loading registration:', error);
    return null;
  }
};

// Save a new registration (public - no auth required)
export const saveRegistration = async (formData: RegistrationInsert): Promise<string> => {
  try {
    if (!formData.edition_id) {
      throw new Error('No edition ID provided');
    }

    const registrationData = {
      name: formData.name,
      phone: formData.phone,
      age: formData.age,
      grade: formData.grade,
      gender: formData.gender,
      church: formData.church,
      participant_location: formData.participant_location,
      edition_id: formData.edition_id,
      status: 'pending' as const
    };

    const { data, error } = await supabase
      .from('registrations')
      .insert([registrationData])
      .select('id')
      .single();

    if (error) {
      console.error('Error saving registration:', error);
      throw new Error(error.message || 'Failed to save registration');
    }

    if (!data) {
      throw new Error('No data returned from registration');
    }

    return data.id;
  } catch (error) {
    console.error('Error saving registration:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save registration');
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
  const data = await getAllRegistrations();
  return JSON.stringify(data, null, 2);
};

// Get all editions from Supabase
export const getAllEditions = async (): Promise<Edition[]> => {
  try {
    const { data, error } = await supabase
      .from('editions')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) {
      console.error('Error loading editions:', error);
      throw new Error('Failed to load editions');
    }
    
    return (data || []).map(item => ({
      id: item.id,
      year: item.year,
      name: item.name,
      is_active: item.is_active || false,
      start_date: item.start_date,
      end_date: item.end_date,
      event_location: item.event_location || 'Hawassa',
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error loading editions:', error);
    throw new Error('Failed to load editions');
  }
};

// Get the active edition
export const getActiveEdition = async (): Promise<Edition | null> => {
  try {
    const { data, error } = await supabase
      .from('editions')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();
    
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      year: data.year,
      name: data.name,
      is_active: data.is_active || false,
      start_date: data.start_date,
      end_date: data.end_date,
      event_location: data.event_location || 'Hawassa',
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Error getting active edition:', error);
    return null;
  }
};

// Create a new edition
export const createEdition = async (editionData: {
  year: number;
  name: string;
  start_date: string;
  end_date: string;
  event_location: string;
}): Promise<Edition> => {
  try {
    console.log('Attempting to create edition with data:', {
      year: editionData.year,
      name: editionData.name,
      start_date: editionData.start_date,
      end_date: editionData.end_date,
      event_location: editionData.event_location
    });

    const { data, error } = await supabase
      .from('editions')
      .insert({
        year: editionData.year,
        name: editionData.name,
        start_date: editionData.start_date,
        end_date: editionData.end_date,
        event_location: editionData.event_location,
        is_active: false
      })
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to create edition: ${error.message}`);
    }

    if (!data) {
      console.error('No data returned from Supabase');
      throw new Error('No data returned from database');
    }

    console.log('Successfully created edition:', data);
    
    return {
      id: data.id,
      year: data.year,
      name: data.name,
      is_active: data.is_active || false,
      start_date: data.start_date,
      end_date: data.end_date,
      event_location: data.event_location,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Error in createEdition:', error);
    throw error instanceof Error ? error : new Error('Failed to create edition');
  }
};

// Update edition status (activate/deactivate)
export const updateEditionStatus = async (editionId: number, isActive: boolean): Promise<void> => {
  try {
    console.log('Starting edition status update for edition:', editionId, 'to status:', isActive);
    
    // First check current status of all editions
    const { data: allEditions, error: fetchError } = await supabase
      .from('editions')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching editions:', fetchError);
      throw new Error('Failed to fetch editions');
    }
    
    console.log('Current editions status:', allEditions);
    
    // First deactivate all other editions
    const { error: deactivateError, data: deactivateData } = await supabase
      .from('editions')
      .update({ is_active: false })
      .neq('id', editionId)
      .select('*');

    if (deactivateError) {
      console.error('Error deactivating other editions:', deactivateError);
      throw new Error('Failed to deactivate other editions');
    }
    
    console.log('Deactivated other editions:', deactivateData);

    // Then update the selected edition
    const { error: updateError, data: updateData } = await supabase
      .from('editions')
      .update({ is_active: isActive })
      .eq('id', editionId)
      .select('*');

    if (updateError) {
      console.error('Error updating selected edition:', updateError);
      throw new Error('Failed to update selected edition');
    }
    
    console.log('Updated selected edition:', updateData);
    
    // Verify the final state
    const { data: finalState, error: finalError } = await supabase
      .from('editions')
      .select('*');
    
    if (finalError) {
      console.error('Error verifying final state:', finalError);
      throw new Error('Failed to verify final state');
    }
    
    console.log('Final editions state:', finalState);
  } catch (error) {
    console.error('Error updating edition status:', error);
    throw new Error('Failed to update edition status');
  }
};

// Delete an edition (only if it has no registrations)
export const deleteEdition = async (editionId: number): Promise<void> => {
  try {
    // First check if the edition has any registrations
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select('id')
      .eq('edition_id', editionId)
      .limit(1);

    if (regError) {
      console.error('Error checking registrations:', regError);
      throw new Error('Failed to check registrations');
    }

    if (registrations && registrations.length > 0) {
      throw new Error('Cannot delete edition with registrations');
    }

    // Delete the edition
    const { error } = await supabase
      .from('editions')
      .delete()
      .eq('id', editionId);

    if (error) {
      console.error('Error deleting edition:', error);
      throw new Error('Failed to delete edition');
    }
  } catch (error) {
    console.error('Error deleting edition:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete edition');
  }
};
