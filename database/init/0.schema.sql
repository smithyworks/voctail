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

CREATE TABLE documents (
  document_id       serial      PRIMARY KEY,
  title             text        NOT NULL,
  description       text,
  isPublic          boolean     NOT NULL DEFAULT true,
  content           text,
  author            text        NOT NULL,
);