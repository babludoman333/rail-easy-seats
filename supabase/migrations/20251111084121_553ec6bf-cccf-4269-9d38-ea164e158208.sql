
-- Insert reverse trains for each existing train (incrementing last digit of train number)

-- Reverse of 11077 Jhelum Express (Pune to New Delhi -> New Delhi to Pune)
INSERT INTO trains (number, name, from_station_id, to_station_id, departure_time, arrival_time, duration, class_prices, operating_days, total_seats, price)
SELECT 
  '11078',
  name,
  to_station_id,
  from_station_id,
  arrival_time,
  departure_time,
  duration,
  class_prices,
  operating_days,
  total_seats,
  price
FROM trains WHERE number = '11077'
ON CONFLICT (number) DO NOTHING;

-- Reverse of 12002 Bhopal Shatabdi Express
INSERT INTO trains (number, name, from_station_id, to_station_id, departure_time, arrival_time, duration, class_prices, operating_days, total_seats, price)
SELECT 
  '12003',
  name,
  to_station_id,
  from_station_id,
  arrival_time,
  departure_time,
  duration,
  class_prices,
  operating_days,
  total_seats,
  price
FROM trains WHERE number = '12002'
ON CONFLICT (number) DO NOTHING;

-- Reverse of 12259 Duronto Express
INSERT INTO trains (number, name, from_station_id, to_station_id, departure_time, arrival_time, duration, class_prices, operating_days, total_seats, price)
SELECT 
  '12260',
  name,
  to_station_id,
  from_station_id,
  arrival_time,
  departure_time,
  duration,
  class_prices,
  operating_days,
  total_seats,
  price
FROM trains WHERE number = '12259'
ON CONFLICT (number) DO NOTHING;

-- Reverse of 12301 Howrah Rajdhani (skip as 12302 already exists)
-- Reverse of 12302 Howrah Rajdhani Return -> create 12303
INSERT INTO trains (number, name, from_station_id, to_station_id, departure_time, arrival_time, duration, class_prices, operating_days, total_seats, price)
SELECT 
  '12303',
  name,
  to_station_id,
  from_station_id,
  arrival_time,
  departure_time,
  duration,
  class_prices,
  operating_days,
  total_seats,
  price
FROM trains WHERE number = '12302'
ON CONFLICT (number) DO NOTHING;

-- Reverse of 12434 Tamil Nadu Rajdhani
INSERT INTO trains (number, name, from_station_id, to_station_id, departure_time, arrival_time, duration, class_prices, operating_days, total_seats, price)
SELECT 
  '12435',
  name,
  to_station_id,
  from_station_id,
  arrival_time,
  departure_time,
  duration,
  class_prices,
  operating_days,
  total_seats,
  price
FROM trains WHERE number = '12434'
ON CONFLICT (number) DO NOTHING;

-- Reverse of 12578 Bagmati Express
INSERT INTO trains (number, name, from_station_id, to_station_id, departure_time, arrival_time, duration, class_prices, operating_days, total_seats, price)
SELECT 
  '12579',
  name,
  to_station_id,
  from_station_id,
  arrival_time,
  departure_time,
  duration,
  class_prices,
  operating_days,
  total_seats,
  price
FROM trains WHERE number = '12578'
ON CONFLICT (number) DO NOTHING;

-- Reverse of 12608 Chennai Bangalore Express
INSERT INTO trains (number, name, from_station_id, to_station_id, departure_time, arrival_time, duration, class_prices, operating_days, total_seats, price)
SELECT 
  '12609',
  name,
  to_station_id,
  from_station_id,
  arrival_time,
  departure_time,
  duration,
  class_prices,
  operating_days,
  total_seats,
  price
FROM trains WHERE number = '12608'
ON CONFLICT (number) DO NOTHING;

-- Reverse of 12628 Karnataka Express
INSERT INTO trains (number, name, from_station_id, to_station_id, departure_time, arrival_time, duration, class_prices, operating_days, total_seats, price)
SELECT 
  '12629',
  name,
  to_station_id,
  from_station_id,
  arrival_time,
  departure_time,
  duration,
  class_prices,
  operating_days,
  total_seats,
  price
FROM trains WHERE number = '12628'
ON CONFLICT (number) DO NOTHING;

-- Reverse of 12801 Poorva Express (New Delhi to Parasnath -> Parasnath to New Delhi)
INSERT INTO trains (number, name, from_station_id, to_station_id, departure_time, arrival_time, duration, class_prices, operating_days, total_seats, price)
SELECT 
  '12802',
  name,
  to_station_id,
  from_station_id,
  arrival_time,
  departure_time,
  duration,
  class_prices,
  operating_days,
  total_seats,
  price
FROM trains WHERE number = '12801'
ON CONFLICT (number) DO NOTHING;

-- Reverse of 12903 Golden Temple Mail
INSERT INTO trains (number, name, from_station_id, to_station_id, departure_time, arrival_time, duration, class_prices, operating_days, total_seats, price)
SELECT 
  '12904',
  name,
  to_station_id,
  from_station_id,
  arrival_time,
  departure_time,
  duration,
  class_prices,
  operating_days,
  total_seats,
  price
FROM trains WHERE number = '12903'
ON CONFLICT (number) DO NOTHING;
