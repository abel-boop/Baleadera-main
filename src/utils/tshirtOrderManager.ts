import { supabase } from "@/integrations/supabase/client";
import { TShirtOrder, TShirtOrderCreate, TShirtOrderUpdate, TShirtOrderStatus } from "@/types/tshirt-order";
import { Database } from "@/integrations/supabase/types";

type OrderWithRelations = Database['public']['Tables']['tshirt_orders']['Row'] & {
  registrations: Database['public']['Tables']['registrations']['Row'] | null;
};

export const createTShirtOrder = async (orderData: TShirtOrderCreate): Promise<TShirtOrder> => {
  const { data, error } = await supabase
    .from('tshirt_orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating T-shirt order:', error);
    throw new Error(error.message);
  }

  return data as TShirtOrder;
};

export const getTShirtOrder = async (id: string): Promise<TShirtOrder | null> => {
  const { data, error } = await supabase
    .from('tshirt_orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Not found
      return null;
    }
    console.error('Error fetching T-shirt order:', error);
    throw new Error(error.message);
  }

  return data as TShirtOrder;
};

export const getTShirtOrdersByRegistration = async (registrationId: string): Promise<TShirtOrder[]> => {
  const { data, error } = await supabase
    .from('tshirt_orders')
    .select('*')
    .eq('registration_id', registrationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching T-shirt orders:', error);
    throw new Error(error.message);
  }

  return data as TShirtOrder[];
};

export const updateTShirtOrder = async (
  id: string, 
  updates: TShirtOrderUpdate
): Promise<TShirtOrder> => {
  const { data, error } = await supabase
    .from('tshirt_orders')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating T-shirt order:', error);
    throw new Error(error.message);
  }

  return data as TShirtOrder;
};

export const cancelTShirtOrder = async (id: string): Promise<{ data: OrderWithRelations | null; error: Error | null }> => {
  try {
    // First get the order with relations to return it later
    const { data: orderData, error: fetchError } = await supabase
      .from('tshirt_orders')
      .select(`
        *,
        registrations (*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching T-shirt order:', fetchError);
      return { data: null, error: new Error(fetchError.message) };
    }

    // Update the order status
    const { data, error } = await supabase
      .from('tshirt_orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error cancelling T-shirt order:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Return the updated order with relations
    return { 
      data: { 
        ...data, 
        registrations: orderData?.registrations || null 
      } as OrderWithRelations, 
      error: null 
    };
  } catch (error) {
    console.error('Unexpected error in cancelTShirtOrder:', error);
    return { 
      data: null, 
      error: error instanceof Error 
        ? error 
        : new Error('An unexpected error occurred') 
    };
  }
};

export const verifyTShirtOrder = async (id: string): Promise<{ data: OrderWithRelations | null; error: Error | null }> => {
  try {
    // First get the order with relations to return it later
    const { data: orderData, error: fetchError } = await supabase
      .from('tshirt_orders')
      .select(`
        *,
        registrations (*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching T-shirt order:', fetchError);
      return { data: null, error: new Error(fetchError.message) };
    }

    // Update the order status
    const { data, error } = await supabase
      .from('tshirt_orders')
      .update({ 
        status: 'verified',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error verifying T-shirt order:', error);
      return { data: null, error: new Error(error.message) };
    }

    // Return the updated order with relations
    return { 
      data: { 
        ...data, 
        registrations: orderData?.registrations || null 
      } as OrderWithRelations, 
      error: null 
    };
  } catch (error) {
    console.error('Unexpected error in verifyTShirtOrder:', error);
    return { 
      data: null, 
      error: error instanceof Error 
        ? error 
        : new Error('An unexpected error occurred') 
    };
  }
};

export const getTShirtOrders = async (filters: {
  status?: TShirtOrderStatus;
  editionId?: number;
} = {}): Promise<{ data: OrderWithRelations[] | null; error: Error | null }> => {
  try {
    let query = supabase
      .from('tshirt_orders')
      .select(`
        *,
        registrations (
          id,
          name,
          phone,
          participant_location
        )
      `)
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.editionId) {
      query = query.eq('edition_id', filters.editionId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching T-shirt orders:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as unknown as OrderWithRelations[], error: null };
  } catch (error) {
    console.error('Unexpected error in getTShirtOrders:', error);
    return { 
      data: null, 
      error: error instanceof Error 
        ? error 
        : new Error('An unexpected error occurred') 
    };
  }
};
