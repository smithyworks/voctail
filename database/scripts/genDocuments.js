// Example usage:
// $ node genDocuments.js > ../init/5.documents.sql

const fs = require("fs");

// We define the files to go through in this variable.
const fileNames = ["document001.txt", "document002.txt"];

try {
  console.log(
    "COPY documents (document_id, publisher_id, title, author, description, public, premium, blocks) FROM stdin;"
  );
  let document_id = 1;
  fileNames.forEach((name) => {
    // read contents of the file
    const data = fs.readFileSync("./data/documents/" + name, "UTF-8");

    // split the contents by new line
    const lines = data.split(/\r?\n/);

    let title = "";
    let author = "";
    let description = "";

    const blocks = [];

    let currentType;
    let currentContent;

    lines.forEach((line, i) => {
      // Encountered newline, current block set empty
      if (line.trim() === "") {
        // If not empty block, type will be set to something.
        // Therefore, we push it to blocks
        if (currentType) {
          switch (currentType) {
            case "metadata_title":
              title = currentContent;
              break; // make sure to break out on match
            case "metadata_author":
              author = currentContent;
              break;
            case "metadata_description":
              description = currentContent;
              break;
            case "title":
              blocks.push({ type: currentType, content: currentContent });
              break;
            case "subtitle":
              blocks.push({ type: currentType, content: currentContent });
              break;
            case "paragraph":
              blocks.push({ type: currentType, content: currentContent });
              break;
            default:
              throw new Error(
                `There is no case taking type "${currentType}" into account (line ${
                  i + 1
                }, file '${name}').`
              );
          }
        }
        blocks.push({ type: currentType, content: currentContent });

        // Reset block
        currentType = null;
        currentContent = null;

        return; // no need to check for other block types
      }

      // Test for marked up line
      const matchData = line.match(/^(?<key>>\w+|#+) (?<content>.*$)/);
      if (matchData) {
        switch (matchData.groups.key) {
          case ">title":
            currentType = "metadata_title";
            break; // make sure to break out on match
          case ">author":
            currentType = "metadata_author";
            break;
          case ">description":
            currentType = "metadata_description";
            break;
          case "#":
            currentType = "title";
            break;
          case "##":
            currentType = "subtitle";
            break;
          default:
            throw new Error(
              `Encountered malformed line with markup key: "${
                matchData.groups.key
              }"\n  file '${name}' line ${i + 1}: "${line}"`
            );
        }

        // Set current content, since this is the first line of this block, no need to add a space.
        currentContent = matchData.groups.content.trim();
      } else if (!currentType) {
        // If currentType is unset, this means we are on the first line of a paragraph.
        currentType = "paragraph";
        currentContent = line.trim();
      } else {
        // If we reach here, we are adding a line to the current block.
        // We want to make sure to add a space.
        currentContent += " " + line.trim();
      }
    });

    // Generate "random" variation in data for "premium" attribute
    const premium = Math.random() > 0.5 ? true : false;

    // document_id, publisher_id, title, author, description, public, premium, blocks
    console.log(
      `${document_id++}\t\\N\t${title}\t${author}\t${
        description ? description : "\\N"
      }\tt\t${premium ? "true" : "false"}\t${JSON.stringify(blocks)}`
    );
  });
  console.log("\\.");
  console.log(
    `ALTER SEQUENCE documents_document_id_seq RESTART WITH ${document_id};`
  );
} catch (err) {
  console.error(err);
}
