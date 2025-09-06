-- Add comprehensive train coverage with varied class pricing
-- Delete existing trains to avoid duplicates
DELETE FROM trains;

-- Insert comprehensive train network with proper class pricing
INSERT INTO trains (
  number, name, from_station_id, to_station_id, 
  departure_time, arrival_time, duration, price, 
  class_prices, operating_days, total_seats
) VALUES 
-- Delhi connections to all major cities
('12951', 'Rajdhani Express', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'BCT'),
 '16:00', '08:35', '16h 35m', 3200,
 '{"1A": 8500, "2A": 4200, "3A": 2800}', 
 ARRAY['Tuesday', 'Thursday', 'Saturday'], 95),

('12301', 'Howrah Rajdhani', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'HWH'),
 '17:05', '10:05', '17h 00m', 2899,
 '{"1A": 6200, "2A": 3100, "3A": 2200, "SL": 1450}', 
 ARRAY['Tuesday', 'Thursday', 'Saturday'], 88),

('12434', 'Chennai Rajdhani', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'MAS'),
 '15:55', '09:45', '17h 50m', 3600,
 '{"1A": 7800, "2A": 4100, "3A": 2900, "SL": 1850}', 
 ARRAY['Monday', 'Wednesday', 'Friday'], 92),

('12423', 'Dibrugarh Rajdhani', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'GUY'),
 '12:55', '18:30', '29h 35m', 4200,
 '{"1A": 9500, "2A": 5200, "3A": 3600, "SL": 2400}', 
 ARRAY['Wednesday', 'Saturday'], 85),

-- Mumbai connections
('12953', 'August Kranti Rajdhani', 
 (SELECT id FROM stations WHERE code = 'BCT'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '17:25', '09:55', '16h 30m', 3200,
 '{"1A": 8500, "2A": 4200, "3A": 2800}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 95),

('11077', 'Jhelum Express', 
 (SELECT id FROM stations WHERE code = 'PUNE'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '11:25', '06:25', '19h 00m', 1699,
 '{"2A": 2800, "3A": 1900, "SL": 850, "2S": 420}', 
 ARRAY['Monday', 'Wednesday', 'Friday'], 78),

('12137', 'Punjab Mail', 
 (SELECT id FROM stations WHERE code = 'BCT'), 
 (SELECT id FROM stations WHERE code = 'LJN'),
 '19:15', '18:40', '23h 25m', 1850,
 '{"2A": 3200, "3A": 2100, "SL": 950, "2S": 485}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 82),

-- Kolkata connections
('12259', 'Duronto Express', 
 (SELECT id FROM stations WHERE code = 'HWH'), 
 (SELECT id FROM stations WHERE code = 'BCT'),
 '11:40', '15:55', '28h 15m', 2200,
 '{"1A": 7200, "2A": 4200, "3A": 2800, "SL": 1450}', 
 ARRAY['Tuesday', 'Thursday', 'Sunday'], 95),

('12302', 'Howrah Rajdhani', 
 (SELECT id FROM stations WHERE code = 'HWH'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '16:55', '10:05', '17h 10m', 2950,
 '{"1A": 6200, "2A": 3100, "3A": 2200, "SL": 1450}', 
 ARRAY['Monday', 'Wednesday', 'Friday'], 88),

-- Chennai connections  
('12608', 'Chennai Bangalore Express', 
 (SELECT id FROM stations WHERE code = 'MAS'), 
 (SELECT id FROM stations WHERE code = 'SBC'),
 '13:30', '19:15', '5h 45m', 680,
 '{"2A": 1800, "3A": 1200, "SL": 580, "2S": 285}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 72),

('12903', 'Golden Temple Mail', 
 (SELECT id FROM stations WHERE code = 'MAS'), 
 (SELECT id FROM stations WHERE code = 'ADI'),
 '22:15', '10:05', '35h 50m', 2200,
 '{"2A": 4200, "3A": 2800, "SL": 1350, "2S": 650}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 88),

-- Bangalore connections
('12628', 'Karnataka Express', 
 (SELECT id FROM stations WHERE code = 'SBC'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '20:00', '05:25', '33h 25m', 2450,
 '{"2A": 4800, "3A": 3200, "SL": 1450, "2S": 720}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 85),

-- Add Shatabdi and other premium trains
('12002', 'Bhopal Shatabdi', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'BPL'),
 '06:05', '13:48', '7h 43m', 1450,
 '{"CC": 1450, "EC": 2250}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 78),

-- Regional connections
('22691', 'Rajdhani Express', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'BBS'),
 '06:45', '06:00', '23h 15m', 2850,
 '{"1A": 6800, "2A": 3600, "3A": 2450, "SL": 1250}', 
 ARRAY['Monday', 'Wednesday', 'Friday'], 82),

('12046', 'Shatabdi Express', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'LJN'),
 '06:10', '12:35', '6h 25m', 980,
 '{"CC": 980, "EC": 1480}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 68),

-- More inter-city connections
('22413', 'Vande Bharat Express', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'JP'),
 '06:00', '10:25', '4h 25m', 850,
 '{"CC": 850, "EC": 1280}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 64),

('12617', 'Mangala Express', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'ERS'),
 '21:35', '04:15', '30h 40m', 2680,
 '{"2A": 5200, "3A": 3450, "SL": 1580, "2S": 785}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 90),

('16526', 'Island Express', 
 (SELECT id FROM stations WHERE code = 'SBC'), 
 (SELECT id FROM stations WHERE code = 'TVC'),
 '21:45', '12:30', '14h 45m', 1250,
 '{"2A": 2850, "3A": 1950, "SL": 850, "2S": 420}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 78),

-- Additional connections to cover all stations
('12578', 'Bagmati Express', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'PNBE'),
 '15:05', '06:45', '15h 40m', 1350,
 '{"2A": 2950, "3A": 1980, "SL": 850, "2S": 425}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 82),

('12841', 'Coromandel Express', 
 (SELECT id FROM stations WHERE code = 'HWH'), 
 (SELECT id FROM stations WHERE code = 'MAS'),
 '14:45', '17:25', '26h 40m', 1980,
 '{"2A": 4200, "3A": 2850, "SL": 1250, "2S": 620}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 88),

('22925', 'Paschim Express', 
 (SELECT id FROM stations WHERE code = 'BCT'), 
 (SELECT id FROM stations WHERE code = 'ADI'),
 '08:45', '15:30', '6h 45m', 650,
 '{"2A": 1680, "3A": 1120, "SL": 480, "2S": 240}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 75),

-- Add more connections to ensure every major route is covered
('12723', 'Telangana Express', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'HYB'),
 '21:20', '06:45', '33h 25m', 2150,
 '{"2A": 4650, "3A": 3150, "SL": 1420, "2S": 710}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 85);