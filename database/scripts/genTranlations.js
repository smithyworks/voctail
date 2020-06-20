const lineReader = require("line-reader");
const escape = require("pg-escape");

console.log("INSERT INTO translations (term, translation) VALUES");

lineReader.eachLine("./data/dict-en-de.txt", (line, last) => {
  const lineMatch = line.match(/^(?<english>[^\t]*)\t(?<german>[^\t]*)\t/);
  if (lineMatch?.groups) {
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

    if (term && translation && term.split(" ").length === 1)
      console.log(escape(`  (%L, %L)${last ? ";" : ","}`, term, translation));
  }
});
