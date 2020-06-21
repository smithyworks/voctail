const lineReader = require("line-reader");
const escape = require("pg-escape");

async function main() {
  let lineCount = 0;
  let translationCount = 0;

  let word_id = 1;
  const wordLookup = {};
  function trackWord(word, translation) {
    if (!wordLookup[word]) wordLookup[word] = new Set();
    wordLookup[word].add(translation);
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
        trackWord(escape.literal(term), escape.literal(translation));
      }

      if (last) {
        console.log(`-- ${lineCount} dictionary files.`);
        console.log(`-- ${translationCount} translations collected.`);
        console.log(`-- ${wordSet.size} unique words referenced.\n`);

        console.log("DO $$\nDECLARE wid integer;\nBEGIN\n");
        Object.entries(wordLookup).forEach(([k, v]) => {
          console.log(
            `  INSERT INTO words (word, language) VALUES (${k}, 'english') RETURNING word_id INTO wid;`
          );
          console.log(
            `  INSERT INTO translations (word_id, translation, language) VALUES`
          );
          const valueLines = [...v].map((t) => `    (wid, ${t}, 'german')`);
          console.log(valueLines.join(",\n") + ";\n");
        });
        console.log("END\n$$ LANGUAGE plpgsql;");
      }
    }
  });
}

main();
