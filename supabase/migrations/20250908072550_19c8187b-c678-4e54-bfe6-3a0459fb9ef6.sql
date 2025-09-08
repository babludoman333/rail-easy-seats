-- Update class prices to follow logical progression: 2S < SL < CC < 3E < EC < 3A < 2A < 1A
UPDATE trains 
SET class_prices = jsonb_build_object(
  '2S', 250,   -- Second Sitting (cheapest)
  'SL', 400,   -- Sleeper 
  'CC', 600,   -- Chair Car
  '3E', 800,   -- 3rd AC Economy
  'EC', 1200,  -- Executive Chair Car  
  '3A', 1500,  -- 3rd AC
  '2A', 2500,  -- 2nd AC
  '1A', 4500   -- 1st AC (most expensive)
) 
WHERE class_prices IS NOT NULL;