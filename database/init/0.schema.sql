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
  subtitle          text        NOT NULL,
  description       text,
  embedLink         text        NOT NULL,
  isPublic          boolean     NOT NULL DEFAULT true,
  text              text,
  author            serial      NOT NULL
);