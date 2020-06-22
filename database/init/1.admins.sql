INSERT INTO users (user_id, name, email, password, admin, premium) VALUES
    (1, 'Admin', 'admin@voctail.com', '$2b$10$HjiM45j2YQYto6WbVkwH/u3NjvJrhlFjOY4/pbk4g/UURlQpVbBLK', true, true);
SELECT setval(pg_get_serial_sequence('users','user_id'), (SELECT MAX(user_id) from users));


INSERT INTO users (name, email, password, admin, premium) VALUES
  ('Clara', 'clara@voctail.com', '$2b$10$zApz..6fdnLBI2lxwUsq5uZt2qOkpqjs8dQzNLUMk1uT3GRKElNla', true, true),
  ('Ben', 'ben@voctail.com', '$2b$10$fBY8PFZWc9otMnNveHOU/.0vL01gFC/2sHioU2SBPrD5nw6I3nDaq', true, true),
  ('Ryan', 'ryan@voctail.com', '$2b$10$20uI..oITRujWr8Mm7pm8eraqymAm1z1mttA4ib1eDWUJLGwqZAem', true, true),
  ('Christopher', 'christo@voctail.com', '$2b$10$ruRdtS1OyeFGLY62I7lW4eatR9nS0jQJ76.t3.skVS7xk79ZKamvm', true, true);
  