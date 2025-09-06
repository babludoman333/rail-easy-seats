-- Add more trains with varied class pricing without deleting existing ones
INSERT INTO trains (
  number, name, from_station_id, to_station_id, 
  departure_time, arrival_time, duration, price, 
  class_prices, operating_days, total_seats
) VALUES 
-- Additional Delhi connections
('22414', 'Vande Bharat Express Return', 
 (SELECT id FROM stations WHERE code = 'JP'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '15:30', '19:55', '4h 25m', 850,
 '{"CC": 1850, "EC": 1280}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 64),

('12004', 'Bhopal Shatabdi Return', 
 (SELECT id FROM stations WHERE code = 'BPL'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '14:30', '21:15', '6h 45m', 1450,
 '{"CC": 1850, "EC": 2450}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 78),

('12579', 'Bagmati Express Return', 
 (SELECT id FROM stations WHERE code = 'PNBE'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '19:25', '11:05', '15h 40m', 1350,
 '{"2A": 2950, "3A": 1980, "SL": 1350, "2S": 525}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 82),

-- Mumbai to other cities
('12618', 'Mangala Express Return', 
 (SELECT id FROM stations WHERE code = 'ERS'), 
 (SELECT id FROM stations WHERE code = 'BCT'),
 '08:50', '15:30', '30h 40m', 2680,
 '{"2A": 5200, "3A": 3450, "SL": 2680, "2S": 885}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 90),

-- More inter-city connections
('12629', 'Karnataka Express Return', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'SBC'),
 '11:50', '21:15', '33h 25m', 2450,
 '{"2A": 4800, "3A": 3200, "SL": 2450, "2S": 820}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 85),

('16527', 'Island Express Return', 
 (SELECT id FROM stations WHERE code = 'TVC'), 
 (SELECT id FROM stations WHERE code = 'SBC'),
 '16:20', '07:05', '14h 45m', 1250,
 '{"2A": 2850, "3A": 1950, "SL": 1250, "2S": 520}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 78),

-- New routes to cover gaps
('12905', 'Ahmedabad Express', 
 (SELECT id FROM stations WHERE code = 'ADI'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '19:45', '12:30', '16h 45m', 1850,
 '{"2A": 3600, "3A": 2400, "SL": 1850, "2S": 625}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 85),

('22692', 'Bhubaneswar Rajdhani Return', 
 (SELECT id FROM stations WHERE code = 'BBS'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '18:30', '17:45', '23h 15m', 2850,
 '{"1A": 6800, "2A": 3600, "3A": 2450, "SL": 1750}', 
 ARRAY['Tuesday', 'Thursday', 'Saturday'], 82),

-- Coimbatore connections
('12676', 'Kovai Express', 
 (SELECT id FROM stations WHERE code = 'CBE'), 
 (SELECT id FROM stations WHERE code = 'MAS'),
 '06:00', '11:30', '5h 30m', 580,
 '{"2A": 1650, "3A": 1100, "SL": 580, "2S": 290}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 72),

-- Visakhapatnam connections
('18645', 'East Coast Express', 
 (SELECT id FROM stations WHERE code = 'VSKP'), 
 (SELECT id FROM stations WHERE code = 'HWH'),
 '20:15', '12:40', '16h 25m', 1420,
 '{"2A": 3200, "3A": 2150, "SL": 1420, "2S": 510}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 80),

-- Indore connections  
('12416', 'Indore Express', 
 (SELECT id FROM stations WHERE code = 'INDB'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '18:30', '07:15', '12h 45m', 1280,
 '{"2A": 2800, "3A": 1850, "SL": 1280, "2S": 440}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 78),

-- Parasnath connections
('13414', 'Intercity Express', 
 (SELECT id FROM stations WHERE code = 'PNME'), 
 (SELECT id FROM stations WHERE code = 'HWH'),
 '07:20', '13:45', '6h 25m', 420,
 '{"2A": 1200, "3A": 800, "SL": 420, "2S": 210}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 65);