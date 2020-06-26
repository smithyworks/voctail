const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "voctail_db",
  password: "password",
  port: 5555,
});

async function main() {
  const { rows } = await pool.query(
    "SELECT * FROM users_words WHERE user_id = 2;"
  );

  console.log(
    "COPY users_words (user_id, word_id, known, certainty, last_seen) FROM stdin;"
  );
  for (let user_id = 1; user_id < 51; user_id++)
    rows.forEach((r) => {
      console.log(
        `${user_id}\t${r.word_id}\t${r.known ? "t" : "f"}\t${
          r.certainty
        }\t2020-06-26 22:30:29.518764+00`
      );
    });
  console.log("\\.");
}

main();
