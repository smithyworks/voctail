const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "voctail_db",
  password: "password",
  port: 5555,
});

const words = [
  "always",
  "seldom",
  "eclipses",
  "predominates",
  "akin",
  "abhorrent",
  "balanced",
  "reasoning",
  "gibe",
  "sneer",
  "drawing",
  "trained",
  "admit",
  "finely",
  "distracting",
  "grit",
  "disturbing",
  "drifted",
  "establishment",
  "sufficient",
  "loathed",
  "soul",
  "remained",
  "lodgings",
  "alternating",
  "drowsiness",
  "faculties",
  "following",
  "clearing",
  "hopeless",
  "vague",
  "account",
  "summons",
  "reigning",
  "press",
  "former",
  "effusive",
  "spirit",
  "gasogene",
  "fashion",
];

async function main() {
  const word_ids = (
    await pool.query(
      "SELECT word_id FROM words WHERE word = ANY($1::text[]);",
      [words]
    )
  ).rows.map((r) => r.word_id);

  const user_ids = (
    await await pool.query("SELECT user_id FROM users;")
  ).rows.map((r) => r.user_id);

  console.log(
    "COPY users_words (user_id, word_id, known, certainty, last_seen) FROM stdin;"
  );
  user_ids.forEach((user_id) => {
    word_ids.forEach((word_id) => {
      console.log(
        `${user_id}\t${word_id}\tf\t1\t2020-06-26 22:30:29.518764+00`
      );
    });
  });
  console.log("\\.");
}

main();
