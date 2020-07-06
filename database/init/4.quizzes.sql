INSERT INTO quizzes (quiz_id, title, questions, is_day, is_custom) VALUES
  (1, 'Quiz Fruits','[
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
    ]',false,true),

  (2, 'Quiz Vehicles','[
    {"vocabulary":"car", "suggestions":["Zug", "Flugzeug", "Rakete"], "translation":"Auto"},
    {"vocabulary":"train", "suggestions":["Auto", "Flugzeug", "Rakete"], "translation":"Zug"},
    {"vocabulary":"plane", "suggestions":["Zug", "Auto", "Rakete"], "translation":"Flugzeug"},
    {"vocabulary":"bike", "suggestions":["Zug", "Flugzeug", "Rakete"], "translation":"Fahrrad"},
    {"vocabulary":"scooter", "suggestions":["Zug", "Flugzeug", "Rakete"], "translation":"Roller"},
    {"vocabulary":"rocket", "suggestions":["Zug", "Flugzeug", "Fahrrad"], "translation":"Rakete"}
    ]',false,true),


  (3, 'Quiz Colors','[
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
    ]',false,true),

  (4, 'Quiz Numbers','[
    {"vocabulary":"one", "suggestions":["zwei", "sechs", "acht"], "translation":"eins"},
    {"vocabulary":"two", "suggestions":["eins", "sechs", "acht"], "translation":"zwei"},
    {"vocabulary":"three", "suggestions":["zwei", "sechs", "acht"], "translation":"drei"},
    {"vocabulary":"four", "suggestions":["zwei", "sechs", "acht"], "translation":"vier"},
    {"vocabulary":"five", "suggestions":["zwei", "sechs", "acht"], "translation":"fünf"},
    {"vocabulary":"six", "suggestions":["zwei", "vier", "acht"], "translation":"sechs"},
    {"vocabulary":"seven", "suggestions":["zwei", "sechs", "acht"], "translation":"sieben"},
    {"vocabulary":"eight", "suggestions":["zwei", "sechs", "sieben"], "translation":"acht"},
    {"vocabulary":"nine", "suggestions":["zwei", "sechs", "acht"], "translation":"neun"},
    {"vocabulary":"ten", "suggestions":["zwei", "sechs", "acht"], "translation":"zehn"}
    ]',false, true);

SELECT setval(pg_get_serial_sequence('quizzes','quiz_id'), (SELECT MAX(quiz_id) from quizzes));

INSERT INTO users_quizzes (user_id, quiz_id) VALUES
  (1,1),
  (1,2),
  (1,3),
  (1,4),
  (2,1),
  (2,2),
  (2,3),
  (2,4),
  (3,1),
  (3,2),
  (3,3),
  (3,4),
  (4,1),
  (4,2),
  (4,3),
  (4,4),
  (5,1),
  (5,2),
  (5,3),
  (5,4);
