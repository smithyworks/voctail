INSERT INTO users (user_id, name, email, password, admin, premium) VALUES
(1,'Admin', 'admin@voctail.com', '$2b$10$HjiM45j2YQYto6WbVkwH/u3NjvJrhlFjOY4/pbk4g/UURlQpVbBLK', true, true);
SELECT setval(pg_get_serial_sequence('users','user_id'), (SELECT MAX(user_id) from users));

INSERT INTO users (name, email, password, admin, premium) VALUES
  ('Clara', 'clara@voctail.com', '$2b$10$zApz..6fdnLBI2lxwUsq5uZt2qOkpqjs8dQzNLUMk1uT3GRKElNla', true, true),
  ('Ben', 'ben@voctail.com', '$2b$10$fBY8PFZWc9otMnNveHOU/.0vL01gFC/2sHioU2SBPrD5nw6I3nDaq', true, true),
  ('Ryan', 'ryan@voctail.com', '$2b$10$20uI..oITRujWr8Mm7pm8eraqymAm1z1mttA4ib1eDWUJLGwqZAem', true, true),
  ('Christopher', 'christo@voctail.com', '$2b$10$ruRdtS1OyeFGLY62I7lW4eatR9nS0jQJ76.t3.skVS7xk79ZKamvm', true, true),

  ('John', 'john@fake.com', '$2b$10$XbYZPVJv0NOF6.2.tMTf/.WTXPRlKbchrqVR6P3uLdo3NTLOesXg6', false, true),
  ('Robert', 'robert@fake.com', '$2b$10$2uOM2x9Hi7T83zpZ9DjsBesNuGqO1fFuRry8e4mv3Ybj6Pthah4T.', false, true),
  ('Michael', 'michae@fake.com', '$2b$10$QHahtTo5wdxmEL6CWM9lueE8gNnxcZHaFD8ArZ.oAXtGzL1nUDAEi', false, false),
  ('William', 'william@fake.com', '$2b$10$nJ9mvuKFFZiiP5o2kEJhw.mG7G75SPMcViZaU1z1BNcP9plJ3Qlyq', false, false),
  ('David', 'david@fake.com', '$2b$10$RWkNcEVlqHpP0NpcxbmlseWotUKl0G3Hak0lvd.0e77vojRMRLmUO', false, false),
  ('Richard', 'richard@fake.com', '$2b$10$znpWn7MtZTwvchEyK0YAJOwzey/y6fggzFxjFUhKfeHZF7xOR0SWa', false, true),
  ('Joseph', 'joseph@fake.com', '$2b$10$gF9jGNe9YplDiU7tyf1x/OKcXnkFrsKe4l429rtD9xxQc1Ei.750.', false, false),
  ('Thomas', 'thomas@fake.com', '$2b$10$bhDjEkc3fOXAptPOMEF1r.ncngo2N9k.VUEngUeRtOxoF8z.zDX82', false, true),
  ('Charles', 'charles@fake.com', '$2b$10$XohlJHL5aD4KPlYaklLNeObvHnyK5ZyfIIiusMhQonTcp2AW7h9ge', false, true),
  ('Daniel', 'daniel@fake.com', '$2b$10$fuen7F3cToFKsroeIRrSvezeu/N9dc7trUNLGjT9flXdGCg9h3G8i', false, true),
  ('Matthew', 'matthew@fake.com', '$2b$10$/ymzdaQXAx3TjDa3Be1nzerBx/3qAW45utJUatUQ3s9s6sSsPUJuK', false, false),
  ('Anthony', 'anthony@fake.com', '$2b$10$mE26PSb2oFNFePSOxkBA9eH1uu10aEueQByucVv0oBLhKfQ8YaJp6', false, false),
  ('Mark', 'mark@fake.com', '$2b$10$hMCk.yKYPUKKkGwbZQUvvuz2jFNQHnqrUcJL4oSwabicX6XDYDXEe', false, false),
  ('Paul', 'paul@fake.com', '$2b$10$.pR1LLPh9zKsUzQsr.zSN.3JhGdxMAuOaEIQ8t5uM7bHXMD5emv4G', false, true),
  ('Steven', 'steven@fake.com', '$2b$10$tHLe5702VjF3hKtGcKWvpOHG8JR3478YI1k4PbJkVnZlWe5XLCj3C', false, false),

  ('Jane', 'jane@fake.com', '$2b$10$SVr5ojHdDKCR36qIQbBWq.w5cnBUmyrUZGOvCfEUkz6YrEmE8xlDa', false, false),
  ('Mary', 'mary@fake.com', '$2b$10$OB35F3iS1lmtOLHMi1GdMul0tBVWVe3kOFjRwSfencAa2wrKBCXCW', false, false),
  ('Jennifer', 'jennifer@fake.com', '$2b$10$.5pifrjY44jMRFW5YI2oYefMQriuZ3DL8HPZKF540PgH.JBba2E/m', false, true),
  ('Linda', 'linda@fake.com', '$2b$10$rVb445mt/dtTSx0TdveDL.9rm5Nd/0Fj7OaejcC2gdf86dVeetKwG', false, true),
  ('Barbara', 'barbara@fake.com', '$2b$10$rCmWXAUhxkSih9sIZVH84.s12s9jn9Hll9Bi8bjr.xQdiXoB.radS', false, false),
  ('Susan', 'susan@fake.com', '$2b$10$FzyJRCShMUhYgr6DEJgRQeIFlSeF3L6c60MpHhazYL8NfJxeh1i0u', false, true),
  ('Jessica', 'jessica@fake.com', '$2b$10$za8SbVQEFbKi1vrf6siBNeK97sPJOuk3W2ribWG/0Lu8E19j.UBg6', false, false),
  ('Sarah', 'sarah@fake.com', '$2b$10$Bd89WlAN123kHo3IGHUTyuLMLbxiT.MDdhyrnER0ctx8ZJS7NefTC', false, false),
  ('Karen', 'karen@fake.com', '$2b$10$.aikDVfmNBxK2zjC7qvLSuxDUqHdzV5.jCexep4Q90BMkwcumP.dq', false, false),
  ('Nancy', 'nancy@fake.com', '$2b$10$OInhMgxk3tQSE42vo1VWheyKUIOsIE1UL27GLRx1Aiz0mhwijXYwO', false, false),
  ('Lisa', 'lisa@fake.com', '$2b$10$rjpKOiCKUlXqOmkRB.aAhO7O.jgQHXxKkGSDX2JY2Rbzi2YwzwkPy', false, true),
  ('Sandra', 'sandra@fake.com', '$2b$10$KmAN2zFArT2moXjgWMUsM.GtN03fvMCPm3wNJM49qpIXp3GeZqpuO', false, true),
  ('Michelle', 'michelle@fake.com', '$2b$10$EK9Fh5E5D7hCn0Pc1yyDNOvs1x2/fu7dRp3.PeyhcTqOJkhCHmmy2', false, false),
  ('Melissa', 'melissa@fake.com', '$2b$10$u0ZGWwI/tjZV/hA1QqOCoO.MCXiPyjNGl9fSYX70p7TzCJUkEOE6a', false, false),
  ('Stephanie', 'stephanie@fake.com', '$2b$10$H1Yaq9jH.Jlpgz5qfRE2ReTYcKrgBcHIswRgwKmVogj7FaDZ9AWFK', false, true);



INSERT INTO quizzes (quiz_id, title, questions, is_day) VALUES
  (1, 'Quiz Fruits','{"questions":[
    {"vocabulary":"banana", "suggestions":["Himbeere", "Erdbeere", "Apfel"], "translation":"Banane"},
    {"vocabulary":"pineapple", "suggestions":["Banane", "Erdbeere", "Apfel"], "translation":"Ananas"},
    {"vocabulary":"orange", "suggestions":["Banane", "Erdbeere", "Apfel"], "translation":"Orange"},
    {"vocabulary":"apple", "suggestions":["Banane", "Erdbeere", "Acai"], "translation":"Apfel"},
    {"vocabulary":"pear", "suggestions":["Banane", "Erdbeere", "Apfel"], "translation":"Birne"},
    {"vocabulary":"peach", "suggestions":["Banane", "Erdbeere", "Apfel"], "translation":"Pfirsich"},
    {"vocabulary":"strawberry", "suggestions":["Banane", "Ananas", "Apfel"], "translation":"Erdbeere"},
    {"vocabulary":"raspberry", "suggestions":["Banane", "Erdbeere", "Apfel"], "translation":"Himbeere"},
    {"vocabulary":"grape", "suggestions":["Banane", "Erdbeere", "Apfel"], "translation":"Traube"},
    {"vocabulary":"acai", "suggestions":["Banane", "Erdbeere", "Apfel"], "translation":"Acai"}
    ]}',false),

  (2, 'Quiz Vehicles','{"questions":[
    {"vocabulary":"car", "suggestions":["Zug", "Flugzeug", "Rakete"], "translation":"Auto"},
    {"vocabulary":"train", "suggestions":["Auto", "Flugzeug", "Rakete"], "translation":"Zug"},
    {"vocabulary":"plane", "suggestions":["Zug", "Auto", "Rakete"], "translation":"Flugzeug"},
    {"vocabulary":"bike", "suggestions":["Zug", "Flugzeug", "Rakete"], "translation":"Fahrrad"},
    {"vocabulary":"scooter", "suggestions":["Zug", "Flugzeug", "Rakete"], "translation":"Roller"},
    {"vocabulary":"rocket", "suggestions":["Zug", "Flugzeug", "Fahrrad"], "translation":"Rakete"}
    ]}',false),


  (3, 'Quiz Colors','{"questions":[
    {"vocabulary":"white", "suggestions":["rot", "schwarz", "gelb"], "translation":"weiß"},
    {"vocabulary":"black", "suggestions":["weiß", "grün", "gelb"], "translation":"schwarz"},
    {"vocabulary":"yellow", "suggestions":["weiß", "schwarz", "türkis"], "translation":"gelb"},
    {"vocabulary":"orange", "suggestions":["weiß", "schwarz", "gelb"], "translation":"orange"},
    {"vocabulary":"red", "suggestions":["weiß", "schwarz", "gelb"], "translation":"rot"},
    {"vocabulary":"green", "suggestions":["weiß", "schwarz", "gelb"], "translation":"grün"},
    {"vocabulary":"blue", "suggestions":["weiß", "schwarz", "gelb"], "translation":"blau"},
    {"vocabulary":"grey", "suggestions":["weiß", "schwarz", "gelb"], "translation":"grau"},
    {"vocabulary":"violet", "suggestions":["weiß", "schwarz", "gelb"], "translation":"violett"},
    {"vocabulary":"turquoise", "suggestions":["weiß", "schwarz", "gelb"], "translation":"türkis"}
    ]}',false),

  (4, 'Quiz Numbers','{"questions":[
    {"vocabulary":"one", "suggestions":["two", "six", "eight"], "translation":"eins"},
    {"vocabulary":"two", "suggestions":["one", "six", "eight"], "translation":"zwei"},
    {"vocabulary":"three", "suggestions":["two", "six", "eight"], "translation":"drei"},
    {"vocabulary":"four", "suggestions":["two", "six", "eight"], "translation":"vier"},
    {"vocabulary":"five", "suggestions":["two", "six", "eight"], "translation":"fünf"},
    {"vocabulary":"six", "suggestions":["two", "four", "eight"], "translation":"sechs"},
    {"vocabulary":"seven", "suggestions":["two", "six", "eight"], "translation":"sieben"},
    {"vocabulary":"eight", "suggestions":["two", "six", "seven"], "translation":"acht"},
    {"vocabulary":"nine", "suggestions":["two", "six", "eight"], "translation":"neun"},
    {"vocabulary":"ten", "suggestions":["two", "six", "eight"], "translation":"zehn"}
    ]}',true);

SELECT setval(pg_get_serial_sequence('quizzes','quiz_id'), (SELECT MAX(quiz_id) from quizzes));

INSERT INTO users_quizzes (user_id, quiz_id) VALUES
  (1,1),
  (1,2),
  (1,3),
  (1,4);
