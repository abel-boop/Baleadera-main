-- Rename location to participant_location in registrations table
ALTER TABLE public.registrations 
RENAME COLUMN location TO participant_location;

-- Add event_location to editions table if it doesn't exist
ALTER TABLE public.editions 
ADD COLUMN IF NOT EXISTS event_location TEXT NOT NULL DEFAULT 'Hawassa';

-- Add comments for clarity
COMMENT ON COLUMN public.registrations.participant_location IS 'The city where the participant is from (e.g., Hawassa, Addis Ababa, etc.)';
COMMENT ON COLUMN public.editions.event_location IS 'The city where the event takes place (e.g., Hawassa)';

-- Update existing records to have a default value for event_location if it's null
UPDATE public.editions 
SET event_location = 'Hawassa' 
WHERE event_location IS NULL;
