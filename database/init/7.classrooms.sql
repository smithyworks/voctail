INSERT INTO classrooms (classroom_id, classroom_owner, title, description, topic, open) VALUES
(10000, 4, 'Class of 2020',
 'In this classroom I will provide material for my students to discover the ancient british history.',
 'British History',
 true),
(20000, 4, 'Class of 2015',
 'In this classroom I will provide material for my students to discover the ancient german history.',
 'German History',
 true);


INSERT INTO classroom_members (classroom_id, student_id) VALUES
    (1, 6), (1,7), (1, 8);

INSERT INTO classroom_documents (classroom_id, document_id) VALUES
    (1, 1), (1, 2), (1, 3);

