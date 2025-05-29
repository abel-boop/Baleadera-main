
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

const STORAGE_KEY = 'youth_forum_registrations';

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate participant ID
const generateParticipantId = (): string => {
  const prefix = 'YEF';
  const year = new Date().getFullYear().toString().substr(-2);
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${prefix}${year}${random}`;
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
