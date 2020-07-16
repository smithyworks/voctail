CREATE TABLE users (
  user_id         serial        PRIMARY KEY,
  name            text          NOT NULL,
  email           text          NOT NULL UNIQUE,
  password        text          NOT NULL,
  premium         boolean       NOT NULL DEFAULT false,
  refresh_token   text,
  admin           boolean       NOT NULL DEFAULT false,
  last_seen       timestamptz
);


CREATE TABLE quizzes (
  quiz_id         serial    PRIMARY KEY,
  title           text      NOT NULL,
  questions       jsonb,
  is_day          boolean   NOT NULL DEFAULT false,
  is_custom       boolean   NOT NULL DEFAULT false,
  created         timestamptz
);


CREATE TABLE users_quizzes (
  user_id         integer    NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  quiz_id         integer    NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  last_seen       timestamptz,
  best_run        integer,
  metrics         jsonb
);

CREATE TABLE quizzes_documents (
  quiz_id         integer    NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  document_id     integer    NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE words (
  word_id         serial        PRIMARY KEY,
  word            text          NOT NULL,
  ignore          boolean       NOT NULL DEFAULT false,
  language        text          NOT NULL,

  UNIQUE (word, language)
);


CREATE TABLE translations (
  translation_id  serial        PRIMARY KEY,
  word_id         integer       NOT NULL REFERENCES words
                                ON DELETE CASCADE,
  contributor_id  integer       REFERENCES users
                                ON DELETE SET NULL,
  translation     text          NOT NULL,
  language        text          NOT NULL,

  UNIQUE (word_id, translation, language)
);


CREATE TABLE users_words (
  user_id         integer       NOT NULL REFERENCES users
                                ON DELETE CASCADE,
  word_id         integer       NOT NULL REFERENCES words
                                ON DELETE CASCADE,
  known           boolean       NOT NULL DEFAULT true,
  certainty       integer       NOT NULL DEFAULT 1,
  encounters      integer       NOT NULL DEFAULT 0,
  last_seen       timestamptz,

  PRIMARY KEY (user_id, word_id)
);


CREATE TABLE documents (
  document_id     serial        PRIMARY KEY,
  publisher_id    integer       REFERENCES users,
  title           text          NOT NULL,
  author          text          NOT NULL,
  description     text,
  category        text,
  video           boolean       NOT NULL DEFAULT FALSE,
  embed_link      text,
  public          boolean       NOT NULL DEFAULT false,
  premium         boolean       NOT NULL DEFAULT false,
  blocks          jsonb
);


CREATE TABLE documents_words (
  document_id     integer       NOT NULL REFERENCES documents
                                ON DELETE CASCADE,
  word_id         integer       NOT NULL REFERENCES words
                                ON DELETE CASCADE,
  frequency       integer       NOT NULL DEFAULT 1,

  PRIMARY KEY (document_id, word_id)
);

CREATE TABLE classrooms (
  classroom_id      serial          PRIMARY KEY,
  classroom_owner   integer         NOT NULL REFERENCES users(user_id)
                                    ON DELETE CASCADE,
  title             text            NOT NULL,
  description       text,
  topic             text,
  open              boolean         NOT NULL DEFAULT false
);

CREATE TABLE classroom_members (
    classroom_id    integer     NOT NULL REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    member_id       integer     REFERENCES users(user_id) ON DELETE CASCADE,
    teacher         boolean     NOT NULL DEFAULT false
);

CREATE TABLE classroom_documents (
    classroom_id    integer     NOT NULL REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    document_id     integer     REFERENCES documents(document_id) ON DELETE CASCADE,
    section         text        NOT NULL DEFAULT 'Others'
)