import { useMemo } from 'react';
import { Registration } from '@/utils/supabaseDataManager';
import { CHURCHES } from '@/constants/churches';

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

  // Get unique values for filters
  const uniqueGrades = useMemo(() => [...new Set(registrations.map(r => r.grade))], [registrations]);
  
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
      const matchesChurch = churchFilter === 'all' || registration.church === churchFilter;
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
