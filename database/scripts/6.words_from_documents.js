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
      .replace(/[.,;:"\(\)\?\!><’‘`]/g, "")
      .replace(/[^a-z]s$/g, "")
      .replace(/(^'|'$)/g, "");
  } catch (err) {
    console.log(err);
    return "";
  }
}

async function main() {
  const fileNames = await getFileNames();

  const wordSet = new Set();

  // Make sure it's offset to the right value
  const {
    rows: [{ nextval }],
  } = await pool.query("SELECT nextval('words_word_id_seq');");
  let word_id = parseInt(nextval);

  console.log("COPY words (word_id, word, ignore, language) FROM stdin;");
  for (let fi = 0; fi < fileNames.length; fi++) {
    const name = fileNames[fi];

    // read contents of the file
    const data = fs.readFileSync("./data/documents/" + name, "UTF-8");

    // split the contents by new line
    const lines = data.split(/\r?\n/);

    for (let li = 0; li < lines.length; li++) {
      const l = lines[li];

      const tokens = l.split(/\s/);
      for (let ti = 0; ti < tokens.length; ti++) {
        const t = tokens[ti];

        const word = clean(t);

        if (word === "" || !word.match(/[a-z]/)) continue;

        const {
          rows: [{ count }],
        } = await pool.query("SELECT COUNT(*) FROM words WHERE word = $1", [
          word,
        ]);

        if (count === "0" && !wordSet.has(word)) {
          wordSet.add(word);
          console.log(`${word_id++}\t${word}\tf\tenglish`);
        }
      }
    }
  }
  console.log("\\.");
  console.log(`ALTER SEQUENCE words_word_id_seq RESTART WITH ${word_id};`);
  console.log("-- Added " + wordSet.size + " words.");
}

main();
