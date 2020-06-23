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
  last_seen       timestamptz
);


CREATE TABLE users_quizzes(
  user_id         integer    NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  quiz_id         integer    NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE
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
  translation     text          NOT NULL,
  language        text          NOT NULL
);

CREATE TABLE users_words (
  user_id         integer       NOT NULL REFERENCES users
                                ON DELETE CASCADE,
  word_id         integer       NOT NULL REFERENCES words
                                ON DELETE CASCADE,
  known           boolean       NOT NULL DEFAULT true,
  certainty       integer       NOT NULL DEFAULT 1,
  last_seen       timestamptz
)
