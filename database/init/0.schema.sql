CREATE TABLE users (
  user_id         serial    PRIMARY KEY,
  name            text      NOT NULL,
  email           text      NOT NULL UNIQUE,
  password        text      NOT NULL,
  refresh_token   text,
  admin           boolean   NOT NULL DEFAULT false,
  last_seen       timestamptz
);