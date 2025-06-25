import { useMemo } from 'react';
import { Registration } from '@/utils/supabaseDataManager';
import { CHURCHES } from '@/constants/churches';

// Predefined list of grades that matches the registration form
const GRADES = [
  'grade-7',
  'grade-8',
  'grade-9',
  'grade-10',
  'grade-11',
  'grade-12'
] as const;

export interface FilterOptions {
  searchTerm?: string;
  statusFilter?: string;
  gradeFilter?: string;
  churchFilter?: string;
  locationFilter?: string;
}

export const useRegistrationFilters = (registrations: Registration[], options: FilterOptions) => {
  const {
    searchTerm = '',
    statusFilter = 'all',
    gradeFilter = 'all',
    churchFilter = 'all',
    locationFilter = 'all'
  } = options;

  // Use the predefined list of grades
  const uniqueGrades = useMemo(() => [...GRADES], []);
  
  const uniqueLocations = useMemo(() => {
    // Get all unique participant locations
    const participantLocations = registrations
      .map(r => r.participant_location)
      .filter((location): location is 'Hawassa' | 'Addis Ababa' => 
        location === 'Hawassa' || location === 'Addis Ababa'
      );
      
    // Combine with default locations and remove duplicates
    return Array.from(new Set([
      'Hawassa',
      'Addis Ababa',
      ...participantLocations
    ]));
  }, [registrations]);

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(registration => {
      const matchesSearch = searchTerm === '' || 
        registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.phone.includes(searchTerm) ||
        registration.church?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.participant_location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
      const matchesGrade = gradeFilter === 'all' || registration.grade === gradeFilter;
      // Handle church matching with or without numbering
      let matchesChurch = churchFilter === 'all';
      
      if (!matchesChurch && registration.church && churchFilter) {
        // Remove any numbering prefix from the filter (e.g., "1. ")
        const cleanFilter = churchFilter.replace(/^\d+\.\s*/, '').trim().toLowerCase();
        const regChurch = registration.church.trim().toLowerCase();
        
        // Check if the registration church matches the filter (with or without numbering)
        matchesChurch = regChurch === cleanFilter;
        
        // Church comparison logic
      }
      const matchesLocation = locationFilter === 'all' || registration.participant_location === locationFilter;
      
      return matchesSearch && matchesStatus && matchesGrade && matchesChurch && matchesLocation;
    });
  }, [registrations, searchTerm, statusFilter, gradeFilter, churchFilter, locationFilter]);

  return {
    filteredRegistrations,
    uniqueGrades,
    uniqueLocations,
    CHURCHES: [...CHURCHES] as string[]
  };
};
