export function parseDocument(data) {
  // split the contents by new line
  const lines = data.split(/\r?\n/);

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
            throw new Error(`There is no case taking type "${currentType}"').`);
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
        case "#":
          currentType = "title";
          break;
        case "##":
          currentType = "subtitle";
          break;
        default:
          throw new Error(`Encountered malformed line with markup key: "${matchData.groups.key}"`);
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

  // document_id, publisher_id, title, author, description, public, premium, blocks
  return blocks;
}
