const lineReader = require("line-reader");
const escape = require("pg-escape");

async function main() {
  let lineCount = 0;
  let translationCount = 0;

  let word_id = 1;
  const wordLookup = {};
  function trackWord(word, translation) {
    if (!wordLookup[word])
      wordLookup[word] = { word_id: word_id++, translations: new Set() };
    wordLookup[word].translations.add(translation);
  }

  const wordSet = new Set();
  const translationsInserts = [];
  await lineReader.eachLine("./data/dict-en-de.txt", (line, last) => {
    const lineMatch = line.match(/^(?<english>[^\t]*)\t(?<german>[^\t]*)\t/);
    if (lineMatch?.groups) {
      lineCount++;
      const term = lineMatch.groups.english
        .replace(/\[.*\]/g, "")
        .replace(/\(.*\)/g, "")
        .replace(/{.*}/g, "")
        .replace(/ +/g, " ")
        .trim()
        .toLowerCase();

      const translation = lineMatch.groups.german
        .replace(/\[.*\]/g, "")
        .replace(/\(.*\)/g, "")
        .replace(/{.*}/g, "")
        .replace(/ +/g, " ")
        .trim();

      if (term && translation && term.split(" ").length === 1) {
        translationCount++;
        trackWord(JSON.stringify(term), JSON.stringify(translation));
      }

      if (last) {
        console.log(`-- ${lineCount} dictionary files.`);
        console.log(`-- ${translationCount} translations collected.`);
        console.log(`-- ${wordSet.size} unique words referenced.\n`);

        console.log("COPY words (word_id, word, ignore, language) FROM stdin;");
        Object.entries(wordLookup).forEach(([k, v]) => {
          console.log(`${v.word_id}\t${JSON.parse(k)}\tf\tenglish`);
        });
        console.log("\\.");
        console.log(
          `ALTER SEQUENCE words_word_id_seq RESTART WITH ${word_id};`
        );

        console.log(
          "COPY translations (translation_id, word_id, translation, language) FROM stdin;"
        );
        let translation_id = 1;
        Object.entries(wordLookup).forEach(([k, v]) => {
          v.translations.forEach((t) => {
            console.log(
              `${translation_id++}\t${v.word_id}\t${JSON.parse(t)}\tgerman`
            );
          });
        });
        console.log("\\.");
        console.log(
          `ALTER SEQUENCE translations_translation_id_seq RESTART WITH ${translation_id};`
        );
      }
    }
  });
}

main();
