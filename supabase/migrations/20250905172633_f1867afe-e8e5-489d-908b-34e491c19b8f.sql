-- Add more trains between different stations  
INSERT INTO public.trains (name, number, from_station_id, to_station_id, departure_time, arrival_time, duration, price, class_prices, operating_days, total_seats) 
SELECT 
  'Golden Temple Mail', '12903', 
  s1.id, s2.id, 
  '22:15:00'::time, '10:05:00'::time, '11h 50m', 2200, 
  '{"1A": 6500, "2A": 3800, "3A": 2200, "SL": 1400}'::jsonb, 
  ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], 88
FROM 
  (SELECT id FROM public.stations WHERE code = 'MAS' LIMIT 1) s1,
  (SELECT id FROM public.stations WHERE code = 'ADI' LIMIT 1) s2
WHERE NOT EXISTS (SELECT 1 FROM public.trains WHERE number = '12903')

UNION ALL

SELECT 
  'Superfast Express', '22208', 
  s1.id, s2.id, 
  '08:20:00'::time, '18:45:00'::time, '10h 25m', 2600, 
  '{"1A": 7200, "2A": 4100, "3A": 2600, "SL": 1650}'::jsonb, 
  ARRAY['Tuesday','Thursday','Saturday'], 92
FROM 
  (SELECT id FROM public.stations WHERE code = 'SBC' LIMIT 1) s1,
  (SELECT id FROM public.stations WHERE code = 'HYB' LIMIT 1) s2
WHERE NOT EXISTS (SELECT 1 FROM public.trains WHERE number = '22208');