import { supabase } from './supabase';

// Fetch printer brands and models
export const fetchPrinterBrands = async () => {
  try {
    const { data: brands, error } = await supabase
      .from('printer_brands')
      .select(`
        id,
        name,
        models:printer_models(id, name, type)
      `)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      models: brand.models.filter((model: any) => model.id).map((model: any) => ({
        id: model.id,
        name: model.name,
        type: model.type
      }))
    }));
  } catch (error) {
    console.error('Error fetching printer brands:', error);
    return [];
  }
};

// Fetch problem categories and problems
export const fetchProblemCategories = async () => {
  try {
    const { data: categories, error } = await supabase
      .from('problem_categories')
      .select(`
        id,
        name,
        icon,
        problems:problems(id, name, description, severity, estimated_time, estimated_cost)
      `)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      problems: category.problems.filter((problem: any) => problem.id).map((problem: any) => ({
        id: problem.id,
        name: problem.name,
        description: problem.description,
        severity: problem.severity,
        estimatedTime: problem.estimated_time,
        estimatedCost: problem.estimated_cost
      }))
    }));
  } catch (error) {
    console.error('Error fetching problem categories:', error);
    return [];
  }
};

// Fetch technicians
export const fetchTechnicians = async () => {
  try {
    const { data: technicians, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return technicians;
  } catch (error) {
    console.error('Error fetching technicians:', error);
    return [];
  }
};

// Admin functions
export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('service_bookings')
      .update({ status })
      .eq('id', bookingId);

    if (error) throw error;

    // Update timeline
    await supabase
      .from('booking_timeline')
      .update({ 
        completed: true, 
        completed_at: new Date().toISOString() 
      })
      .eq('booking_id', bookingId)
      .eq('status', status);

    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
};

export const assignTechnician = async (bookingId: string, technicianId: string) => {
  try {
    const { error } = await supabase
      .from('service_bookings')
      .update({ technician_id: technicianId })
      .eq('id', bookingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error assigning technician:', error);
    return false;
  }
};

export const updateActualCost = async (bookingId: string, actualCost: string) => {
  try {
    const { error } = await supabase
      .from('service_bookings')
      .update({ actual_cost: actualCost })
      .eq('id', bookingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating actual cost:', error);
    return false;
  }
};