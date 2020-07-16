// Example usage (cd into database/scripts):
// $ node 5.documents.js > ../init/5.documents.sql

const fs = require("fs");
const path = require("path");
const { match } = require("assert");

// This function gets the names of all the files insde the ./data/documents folder
function getFileNames() {
  return new Promise((resolve, reject) => {
    const directoryPath = path.join(__dirname, "data/videos");
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
      "COPY documents (document_id, publisher_id, title, author, description, category, video, embed_link, public, premium, blocks) FROM stdin;"
    );
    let document_id = 36;
    fileNames.forEach((name) => {
      // read contents of the file
      const data = fs.readFileSync("./data/videos/" + name, "UTF-8");

      // split the contents by new line
      const lines = data.split(/\r?\n/);

      let title = "";
      let author = "";
      let description = "";
      let category = "";
      let link = "";

      const blocks = [];

      let currentType;
      let currentContent;
      let currentTimestamp;

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
              case "metadata_link":
                link = currentContent;
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
              case "caption":
                blocks.push({
                  type: currentType,
                  content: currentContent,
                  timestamp: currentTimestamp,
                });
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
        const captionMatch = line.match(
          /^(?<timestamp>[0-9]+:[0-9]+) (?<caption>.*$)/
        );
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
            case ">link":
              currentType = "metadata_link";
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
        } else if (captionMatch) {
          currentType = "caption";
          currentContent = captionMatch.groups.caption;
          currentTimestamp = captionMatch.groups.timestamp;
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
      console.log(
        `${document_id++}\t\\N\t${title}\t${author}\t${description}\t${category}\tt\t${link}\tt\t${premium}\t${blocksJson}`
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
