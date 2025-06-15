import { getCurrentEthiopianYear } from './ethiopianDate';

export interface Registration {
  id: string;
  name: string;
  phone: string;
  age: string;
  grade: string;
  gender: string;
  church: string;
  status: 'pending' | 'approved' | 'rejected';
  participantId?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'youth_camp_registrations';

// Find the next available sequential number for the current Ethiopian year
const findNextParticipantNumber = (): { number: number; year: string } => {
  const currentYear = getCurrentEthiopianYear();
  const registrations = getAllRegistrations();
  
  // Extract numbers from IDs that match the current year
  const currentYearIds = registrations
    .filter(reg => {
      const match = reg.participantId?.match(/^BT(\d{3})\/(\d{4})$/);
      return match && match[2] === currentYear;
    })
    .map(reg => {
      const match = reg.participantId?.match(/^BT(\d{3})/);
      return match ? parseInt(match[1], 10) : 0;
    });
  
  const nextNumber = currentYearIds.length > 0 ? Math.max(...currentYearIds) + 1 : 1;
  
  return {
    number: nextNumber,
    year: currentYear
  };
};

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate participant ID with BT prefix, 3-digit sequential number, and Ethiopian year
const generateParticipantId = (): string => {
  const { number, year } = findNextParticipantNumber();
  return `BT${number.toString().padStart(3, '0')}/${year}`;
};

// Get all registrations from localStorage
export const getAllRegistrations = (): Registration[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading registrations:', error);
    return [];
  }
};

// Get a single registration by ID
export const getRegistration = (id: string): Registration | null => {
  const registrations = getAllRegistrations();
  return registrations.find(reg => reg.id === id) || null;
};

// Save a new registration
export const saveRegistration = (formData: Omit<Registration, 'id' | 'status' | 'createdAt' | 'updatedAt'>): string => {
  const registrations = getAllRegistrations();
  const now = new Date().toISOString();
  
  const newRegistration: Registration = {
    ...formData,
    id: generateId(),
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };

  registrations.push(newRegistration);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    return newRegistration.id;
  } catch (error) {
    console.error('Error saving registration:', error);
    throw new Error('Failed to save registration');
  }
};

// Update registration status
export const updateRegistrationStatus = (id: string, status: 'pending' | 'approved' | 'rejected'): void => {
  const registrations = getAllRegistrations();
  const registrationIndex = registrations.findIndex(reg => reg.id === id);
  
  if (registrationIndex === -1) {
    throw new Error('Registration not found');
  }

  const registration = registrations[registrationIndex];
  registration.status = status;
  registration.updatedAt = new Date().toISOString();
  
  // Generate participant ID when approved
  if (status === 'approved' && !registration.participantId) {
    registration.participantId = generateParticipantId();
  }
  
  // Remove participant ID if rejected
  if (status === 'rejected') {
    delete registration.participantId;
  }

  registrations[registrationIndex] = registration;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  } catch (error) {
    console.error('Error updating registration:', error);
    throw new Error('Failed to update registration');
  }
};

// Clear all registrations (for admin use)
export const clearAllRegistrations = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing registrations:', error);
    throw new Error('Failed to clear registrations');
  }
};

// Export registrations as JSON
export const exportRegistrations = (): string => {
  const registrations = getAllRegistrations();
  return JSON.stringify(registrations, null, 2);
};
