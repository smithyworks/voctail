# Voctail Repository

### SEBA Master SoSe 2020 Project - VocTail

## Project Members

- Christopher Peter Smith
- Benedikt Rank
- Clara Lea Buchholz
- Rayane Zaïbet

## Description

Voctail (Vocabulary Cocktail) is a web application that allows German learners to upload a text and read it with the help of interactive English dictionary annotations. The mechanism is as follows:

- A user uploads a German text to the server
- The server then parses the text and uses [dict.cc](https://www.dict.cc)'s English-German vocabulary list to create English annotations
- The user accesses the generated documents and hovers on words to reveal pop-ups containing the English translations

This repository contains the 3 systems that make up our project: the ReactJS frontend, the NodeJS server, and the PostgreSQL database.

## Requirements

- Docker
- Docker Compose
- Node
- Browser plugin to bypass CORS.

## Developing the Backend

To develop the backend, we need to bring up the database on its own and run the server using `nodemon`.

### Running the standalone database

When developing the server, we need to make sure it can access the database first.

To run the database as a standalone, `cd` into `database/` and run:

```bash
$ sudo ./db-run.sh
```

The contents of the `init/` folder are the `.sql` scripts that will initialize the database.

### Running the server with `nodemon`

First `cd` into `server/`, then run:

```bash
$ npx nodemon
```

Now the server will be running on port 8080.

## Developing the frontend

If you are developing the frontend, and don't want to make any modifications to the server or database,
you can run the backend using Docker Compose.

### Running the backend with `docker-compose`

At the root of the repository, run:

```bash
$ sudo docker-compose up
```

To run it in detached mode:

```bash
$ sudo docker-compose up -d
```

To bring it down:

```bash
$ sudo docker-compose down
```

When bringing it down, you can add the following options:

- `--rmi all` to remove the built images
- `-v` or `--volumes` to remove the database volume, and make sure it reinitializes on the next up.

Note: These can be run even if the backend has already been downed.

### Running the React frontend

First `cd` into `frontend/`, then run:

```bash
$ npm start
```
