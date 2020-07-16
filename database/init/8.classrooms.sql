INSERT INTO classrooms (classroom_id, classroom_owner, title, description, topic, open) VALUES
(1, 4, 'Class of 2015',
 'In this classroom I will provide material for my students to discover the ancient german history.',
 'German History',
 true),
(2, 4, 'Class of 2020',
 'In this classroom I will provide material for my students to discover the ancient british history.',
 'British History',
 true);

ALTER SEQUENCE classrooms_classroom_id_seq RESTART WITH 3;


INSERT INTO classroom_members (classroom_id, member_id, teacher) VALUES
    (1, 6, true), (1, 7, false), (1, 8, false);

INSERT INTO classroom_documents (classroom_id, document_id, section) VALUES
    (1, 1, 'Chapter 1'), (1, 2, 'Chapter 2'), (1, 3, 'Chapter 2');

