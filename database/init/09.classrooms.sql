INSERT INTO classrooms (classroom_id, classroom_owner, title, description, topic, open) VALUES
(1, 1, 'British Literature 101', 'Introduction to british literature.', 'Literature', true),
(2, 2, 'History 204', 'Introduction to American history.', 'History', true),
(3, 3, 'Math 601', 'The point at which you stop believing in numbers.', 'Math', true),
(4, 4, 'Basket Weaving 403', 'Advanced basket weaving techniques', 'History', true),
(5, 5, 'English 305', 'English in the workplace.', 'English', true),
(6, 1, 'English 204', 'Introduction to English dialects.', 'English', true),
(7, 2, 'History 205', 'Introduction to American history II.', 'History', true),
(8, 3, 'Math 101', 'Teaching people how to count.', 'Math', true),
(9, 4, 'Tennis 403', 'Intermediate unilateral strengthening.', 'Sports', true),
(10, 5, 'English 302', 'English and Engineering topics.', 'English', true);

ALTER SEQUENCE classrooms_classroom_id_seq RESTART WITH 11;

INSERT INTO classroom_members (classroom_id, member_id, teacher) VALUES
    (1, 1, true), (2, 2, true), (3, 3, true),
    (4, 4, true), (5, 5, true), (6, 1, true),
    (7, 2, true), (8, 3, true), (9, 4, true),
    (10, 5, true),
    (1, 6, true), (1, 7, false), (1, 8, false);

INSERT INTO classroom_documents (classroom_id, document_id, section) VALUES
    (1, 1, 'Chapter 1'), (1, 2, 'Chapter 2'), (1, 3, 'Chapter 2');

