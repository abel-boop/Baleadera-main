-- Fix the participant ID generation function with proper boolean expression
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
    
    -- Find the next available sequence number for this year
    -- Using POSIX regex operator ~ instead of SIMILAR TO for better compatibility
    SELECT COALESCE(
        (SELECT MAX(CAST(SUBSTRING(participant_id, 3, 3) AS INTEGER)) 
         FROM public.registrations 
         WHERE participant_id ~ ('^BT\\d{3}/' || eth_year || '$')),
        0
    ) + 1
    INTO next_seq;
    
    -- Format as BT + 3-digit sequence + / + 4-digit year
    RETURN 'BT' || LPAD(next_seq::text, 3, '0') || '/' || eth_year;
END;
$$;
