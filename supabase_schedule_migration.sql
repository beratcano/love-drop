-- Add schedule columns to courses table if they don't exist
ALTER TABLE courses ADD COLUMN IF NOT EXISTS day_of_week TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS end_time TIME;

-- Helper function to generate random time
CREATE OR REPLACE FUNCTION random_time(start_hour int, end_hour int) 
RETURNS TIME AS $$
DECLARE
  hour int;
  minute int;
BEGIN
  hour := floor(random() * (end_hour - start_hour + 1) + start_hour)::int;
  -- Round minutes to 00 or 30 for cleaner schedule
  IF random() < 0.5 THEN
    minute := 0;
  ELSE
    minute := 30;
  END IF;
  RETURN make_time(hour, minute, 0);
END;
$$ LANGUAGE plpgsql;

-- Update existing courses with random schedule data
DO $$
DECLARE
  r RECORD;
  days TEXT[] := ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  chosen_day TEXT;
  s_time TIME;
  duration_hours INT;
BEGIN
  FOR r IN SELECT id FROM courses LOOP
    -- Pick random day
    chosen_day := days[floor(random() * 5 + 1)::int];
    
    -- Pick random start time between 9 AM and 4 PM (16:00)
    s_time := random_time(9, 15);
    
    -- Duration either 1, 2, or 3 hours
    duration_hours := floor(random() * 3 + 1)::int;
    
    -- Update the record
    UPDATE courses 
    SET 
      day_of_week = chosen_day,
      start_time = s_time,
      end_time = s_time + (duration_hours || ' hours')::interval
    WHERE id = r.id;
  END LOOP;
END $$;
