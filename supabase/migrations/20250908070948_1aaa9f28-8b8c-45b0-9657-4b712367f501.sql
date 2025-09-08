-- Delete all related data to avoid foreign key constraints
DELETE FROM bookings;
DELETE FROM seats;
DELETE FROM trains;

-- Insert comprehensive train network with proper class pricing
INSERT INTO trains (
  number, name, from_station_id, to_station_id, 
  departure_time, arrival_time, duration, price, 
  class_prices, operating_days, total_seats
) VALUES 
-- Delhi connections
('12951', 'Mumbai Rajdhani Express', 
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

('12434', 'Tamil Nadu Rajdhani', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'MAS'),
 '15:55', '09:45', '17h 50m', 3600,
 '{"1A": 7800, "2A": 4100, "3A": 2900, "SL": 1850}', 
 ARRAY['Monday', 'Wednesday', 'Friday'], 92),

('22413', 'Vande Bharat Express', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'JP'),
 '06:00', '10:25', '4h 25m', 850,
 '{"CC": 1850, "EC": 1280}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 64),

('12002', 'Bhopal Shatabdi Express', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'BPL'),
 '06:05', '13:48', '7h 43m', 1450,
 '{"CC": 1850, "EC": 2450}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 78),

('12578', 'Bagmati Express', 
 (SELECT id FROM stations WHERE code = 'NDLS'), 
 (SELECT id FROM stations WHERE code = 'PNBE'),
 '15:05', '06:45', '15h 40m', 1350,
 '{"2A": 2950, "3A": 1980, "SL": 1350, "2S": 525}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 82),

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
 '{"2A": 2800, "3A": 1900, "SL": 1699, "2S": 520}', 
 ARRAY['Monday', 'Wednesday', 'Friday'], 78),

('22925', 'Paschim Express', 
 (SELECT id FROM stations WHERE code = 'BCT'), 
 (SELECT id FROM stations WHERE code = 'ADI'),
 '08:45', '15:30', '6h 45m', 650,
 '{"2A": 1680, "3A": 1120, "SL": 650, "2S": 340}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 75),

-- Kolkata connections
('12259', 'Duronto Express', 
 (SELECT id FROM stations WHERE code = 'HWH'), 
 (SELECT id FROM stations WHERE code = 'BCT'),
 '11:40', '15:55', '28h 15m', 2200,
 '{"1A": 7200, "2A": 4200, "3A": 2800, "SL": 2200}', 
 ARRAY['Tuesday', 'Thursday', 'Sunday'], 95),

('12302', 'Howrah Rajdhani Return', 
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
 '{"2A": 1800, "3A": 1200, "SL": 680, "2S": 385}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 72),

('12903', 'Golden Temple Mail', 
 (SELECT id FROM stations WHERE code = 'MAS'), 
 (SELECT id FROM stations WHERE code = 'ADI'),
 '22:15', '10:05', '35h 50m', 2200,
 '{"2A": 4200, "3A": 2800, "SL": 2200, "2S": 750}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 88),

-- Bangalore connections
('12628', 'Karnataka Express', 
 (SELECT id FROM stations WHERE code = 'SBC'), 
 (SELECT id FROM stations WHERE code = 'NDLS'),
 '20:00', '05:25', '33h 25m', 2450,
 '{"2A": 4800, "3A": 3200, "SL": 2450, "2S": 820}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 85),

('16526', 'Island Express', 
 (SELECT id FROM stations WHERE code = 'SBC'), 
 (SELECT id FROM stations WHERE code = 'TVC'),
 '21:45', '12:30', '14h 45m', 1250,
 '{"2A": 2850, "3A": 1950, "SL": 1250, "2S": 520}', 
 ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 78);