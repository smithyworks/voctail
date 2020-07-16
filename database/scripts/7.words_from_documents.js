const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "voctail_db",
  password: "password",
  port: 5555,
});

function getFileNames() {
  return new Promise((resolve, reject) => {
    const directoryPath = path.join(__dirname, "data/documents");
    fs.readdir(directoryPath, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

function clean(word) {
  try {
    word = word.replace(/[ \t\r\n]/g, "");
    return word
      .toLowerCase()
      .replace(/[.,;:"()?!><’‘”“`]/g, "")
      .replace(/[^a-z]s$/g, "")
      .replace(/(^'|'$)/g, "");
  } catch (err) {
    console.log(err);
    return "";
  }
}

async function main() {
  const { rows: documentRecords } = await pool.query(
    "SELECT * FROM documents;"
  );
  const wordSet = new Set();

  // Make sure it's offset to the right value
  const {
    rows: [{ nextval }],
  } = await pool.query("SELECT nextval('words_word_id_seq');");
  let word_id = parseInt(nextval);

  const newWords = [];
  const documentWords = [];

  for (let dri = 0; dri < documentRecords.length; dri++) {
    const document = documentRecords[dri];

    const content = document.blocks.map((b) => b.content).join(" ");
    const words = content
      .split(/\s/)
      .map((token) => clean(token))
      .filter((word) => word !== "");

    const frequencies = {};

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];

      if (word === "") continue;

      const {
        rows,
      } = await pool.query("SELECT word_id FROM words WHERE word = $1", [word]);
      let current_word_id = rows[0]?.word_id;

      // If the word doesn't exist, we need to add it to the database.
      if (!current_word_id) {
        let wordRecord = newWords.find((w) => w.word === word);
        if (!wordRecord) {
          wordRecord = { word_id: word_id++, word };
          newWords.push(wordRecord);
        }

        current_word_id = wordRecord.word_id;
      }

      if (!frequencies[current_word_id]) frequencies[current_word_id] = 1;
      else frequencies[current_word_id]++;
    }

    documentWords[document.document_id] = frequencies;
  }

  console.log("COPY words (word_id, word, ignore, language) FROM stdin;");
  newWords.forEach((nw) => {
    console.log(`${nw.word_id}\t${nw.word}\tf\tenglish`);
  });
  console.log("\\.");
  console.log(`ALTER SEQUENCE words_word_id_seq RESTART WITH ${word_id};`);

  console.log(
    "COPY documents_words (document_id, word_id, frequency) FROM stdin;"
  );
  Object.entries(documentWords).forEach(([document_id, frequencies]) => {
    Object.entries(frequencies).forEach(([word_id, frequency]) => {
      console.log(`${document_id}\t${word_id}\t${frequency}`);
    });
  });
  console.log("\\.");
}

main();
