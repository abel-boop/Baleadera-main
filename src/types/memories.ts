export interface MemoryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  date?: string;
  location?: string;
}

export interface MemoryRound {
  id: string;
  title: string;
  description?: string;
  date: string;
  images: MemoryImage[];
}

// Utility function to generate a unique ID
export const generateId = (prefix: string) => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to format date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
