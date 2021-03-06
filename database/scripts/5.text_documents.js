// Example usage (cd into database/scripts):
// $ node 5.documents.js > ../init/5.documents.sql

const fs = require("fs");
const path = require("path");

// This function gets the names of all the files insde the ./data/documents folder
function getFileNames() {
  return new Promise((resolve, reject) => {
    const directoryPath = path.join(__dirname, "data/documents");
    fs.readdir(directoryPath, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

async function main() {
  try {
    const fileNames = await getFileNames();

    console.log(
      "COPY documents (document_id, publisher_id, title, author, description, category, public, premium, blocks) FROM stdin;"
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
      let category = "";

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
              case "metadata_category":
                category = currentContent;
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
            case ">category":
              currentType = "metadata_category";
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
      const premium = Math.random() > 0.5 ? "t" : "f";

      // Escape the escapes
      const blocksJson = JSON.stringify(blocks).replace(/\\/g, "\\\\");

      // Description can be null
      description = description ? description : "\\N";

      // document_id, publisher_id, title, author, description, public, premium, blocks
      let publisher = "\\N";
      // have some publishers
      for (let i = 10; i < 35; i++) {
        if (document_id > 10) {
          if (document_id < 15) publisher = 2;
          else {
            if (document_id < 20) publisher = 3;
            else {
              if (document_id < 25) publisher = 4;
              else {
                if (document_id < 30) publisher = 5;
                else publisher = 6;
              }
            }
          }
        }
      }
      if (document_id)
        console.log(
          `${document_id++}\t${publisher}\t${title}\t${author}\t${description}\t${category}\tt\t${premium}\t${blocksJson}`
        );
    });
    console.log("\\.");
    console.log(
      `ALTER SEQUENCE documents_document_id_seq RESTART WITH ${document_id};`
    );
  } catch (err) {
    console.error(err);
  }
}

main();
