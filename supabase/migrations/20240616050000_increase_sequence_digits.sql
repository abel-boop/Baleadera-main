-- Update to use 4-digit sequence numbers to support more participants
CREATE OR REPLACE FUNCTION public.generate_participant_id()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    next_seq integer;
    eth_year text;
    current_greg_date date := CURRENT_DATE;
    greg_year integer;
    greg_month integer;
    greg_day integer;
    eth_year_num integer;
    max_seq integer;
BEGIN
    -- Get current Gregorian date components
    greg_year := EXTRACT(YEAR FROM current_greg_date)::integer;
    greg_month := EXTRACT(MONTH FROM current_greg_date)::integer;
    greg_day := EXTRACT(DAY FROM current_greg_date)::integer;
    
    -- Calculate Ethiopian year (Ethiopian New Year is September 11 or 12)
    IF greg_month > 9 OR (greg_month = 9 AND greg_day >= 11) THEN
        eth_year_num := greg_year - 7;
    ELSE
        eth_year_num := greg_year - 8;
    END IF;
    
    eth_year := eth_year_num::text;
    
    -- Find the maximum sequence number for the current year
    -- Using SUBSTRING to get the 4 digits between 'BT' and '/'
    SELECT COALESCE(MAX(CAST(SUBSTRING(participant_id, 3, 4) AS INTEGER)), 0)
    INTO max_seq
    FROM public.registrations
    WHERE participant_id LIKE 'BT____/' || eth_year;  -- 4 underscores for 4 digits
    
    -- Set the next sequence number
    next_seq := COALESCE(max_seq, 0) + 1;
    
    -- Format as BT + 4-digit sequence + / + 4-digit year
    -- This gives us IDs like BT0001/2017, BT0002/2017, ..., BT9999/2017
    RETURN 'BT' || LPAD(next_seq::text, 4, '0') || '/' || eth_year;
    
EXCEPTION WHEN OTHERS THEN
    -- If anything goes wrong, return a fallback ID with timestamp
    RAISE WARNING 'Error generating participant ID: %', SQLERRM;
    RETURN 'BT' || LPAD((EXTRACT(EPOCH FROM NOW()) % 10000)::text, 4, '0') || '/' || eth_year;
END;
$$;
