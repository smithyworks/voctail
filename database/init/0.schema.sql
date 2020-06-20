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

CREATE TABLE translations (
  translation_id  serial    PRIMARY KEY,
  term            text      NOT NULL,
  translation     text      NOT NULL,
  ignore          boolean   NOT NULL DEFAULT false
);