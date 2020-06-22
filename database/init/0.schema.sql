CREATE TABLE users (
  user_id         serial    PRIMARY KEY,
  name            text      NOT NULL,
  email           text      NOT NULL UNIQUE,
  password        text      NOT NULL,
  premium         boolean   NOT NULL DEFAULT false,
  refresh_token   text,
  admin           boolean   NOT NULL DEFAULT false,
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

