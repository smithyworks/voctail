import React, { useRef, useState } from "react";
import { toasts } from "../common/AppPage";
import { api } from "../../utils";
import VTButton from "../common/VTButton";
import AddIcon from "@material-ui/icons/Add";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import ImageIcon from "@material-ui/icons/Image";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  container: { height: 200, width: "100%" },
  grid: { height: 100, width: "100%" },
  userItem: { width: "150px" },

  //gridlist with documents
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.54)",
  },
  gridList: { width: "100%", height: 800, justifyContent: "space-around" },
  icon: { color: "rgba(255,255,255,0.54)" },
}));
/*
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

 */

/*
function AddWordsFromNewDocument() {
    //const { document_id } = req.body;
    const { rows: documentRecords } = await pool.query(
        "SELECT * FROM documents WHERE document_id=$1;"
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
*/
function UploadDocument({ refresh, publisherId }) {
  const titleInput = useRef("");
  const authorInput = useRef("");
  const descriptionInput = useRef("");
  const [publicDocument, setPublicDocument] = useState(true);

  const contentInput = useRef("");
  //const imageInput = useRef(); todo use image
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const classes = useStyles();

  const handleAddOpen = () => {
    setOpen(true);
  };
  const handleAddClose = () => {
    setOpen(false);
  };
  const handleStatusChange = (event) => {
    setPublicDocument(event.target.checked);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  function readFile() {
    const uploadedFile = document.getElementById("upload-file").files[0];

    let reader = new FileReader();
    reader.readAsText(uploadedFile);

    const blocks = [];
    let currentType;
    let currentContent;

    reader.onloadend = function () {
      console.log("onload", reader.result);
      const lines = reader.result.split(/\r?\n/);
      console.log("lines in onload", lines);

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
                throw new Error(`There is no case taking type "${currentType}" into account (line ${i + 1}').`);
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
              throw new Error(
                `Encountered malformed line with markup key: "${matchData.groups.key}"\n  line ${i + 1}: "${line}"`
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

      contentInput.current = JSON.stringify(blocks).replace(/\\/g, "\\\\");
    };
  }
  //verify the metadata and the document for the upload to prevent false uploads
  function verify() {
    if (titleInput.current.length <= 1) {
      toasts.toastWarning("Please insert the title before uploading your document.");
      return false;
    }
    if (authorInput.current.length <= 1) {
      toasts.toastWarning("Please insert an author before uploading your document.");
      return false;
    }
    if (category.length <= 1) {
      toasts.toastWarning("Please select a category before uploading your document.");
      return false;
    }
    if (document.getElementById("upload-file").files.length === 0) {
      toasts.toastWarning("Please upload the text document.");
      return false;
    }

    toasts.toastInfo("Metadata verified.");
    return true;
  }

  function resetValues() {
    setPublicDocument(true);
    setCategory("");
    titleInput.current = "";
    authorInput.current = "";
    descriptionInput.current = "";
    contentInput.current = "";
  }

  const addThisDocument = () => {
    readFile();
    console.log("contentInput in add this document", contentInput.current);

    api
      .addDocument(
        publisherId,
        titleInput.current,
        authorInput.current,
        descriptionInput.current,
        category,
        publicDocument,
        contentInput.current
      )
      .then(() => {
        toasts.toastSuccess("The document was successfully added!");
        refresh();
        resetValues();
        handleAddClose();
      })
      .catch((err) => {
        console.log(err);
        toasts.toastError("Error uploading the document!");
      });
  };

  return (
    <div>
      <VTButton neutral startIcon={<AddIcon />} onClick={handleAddOpen}>
        Add a new document
      </VTButton>

      <Dialog open={open} onClose={handleAddClose} aria-labelledby="add-new-document">
        <DialogTitle id="add-new-document">Add a document</DialogTitle>
        <DialogContent>
          <DialogContentText>To add a new text document please fill in the additional data.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title*"
            type="title"
            onChange={(e) => (titleInput.current = e.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="author"
            label="Author*"
            type="author"
            onChange={(e) => (authorInput.current = e.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="description"
            onChange={(e) => (descriptionInput.current = e.target.value)}
            fullWidth
          />
          <DialogContentText>Please upload your text document.</DialogContentText>
          <input accept="txt/*" className={classes.input} id="upload-file" multiple type="file" />
          <label htmlFor="upload-text">
            <VTButton secondary component="span" startIcon={<DescriptionIcon />}>
              Upload
            </VTButton>
          </label>
          <DialogContentText>
            You can upload a preview image for your text document or choose one from our example pictures.
          </DialogContentText>
          <input accept="image/*" className={classes.input} id="upload-preview-image" multiple type="file" />
          <label htmlFor="upload-preview-image">
            <VTButton secondary component="span" startIcon={<ImageIcon />}>
              Upload
            </VTButton>
          </label>
          <DialogContentText>
            Your document is public and available to all users. If you want to keep your document private please
            deactivate the document status.
          </DialogContentText>
          <FormControlLabel
            control={
              <Checkbox
                name="checkedH"
                onChange={handleStatusChange}
                checked={publicDocument}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
            label="Public Document"
          />

          <FormControl className={classes.formControl}>
            <InputLabel shrink id="choose-category">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="choose-category"
              value={category}
              onChange={handleCategoryChange}
              displayEmpty
              className={classes.selectEmpty}
            >
              <MenuItem value={"Others"}>
                <em>Others</em>
              </MenuItem>
              <MenuItem value={"Fairy Tale"}>Fairy Tale</MenuItem>
              <MenuItem value={"(Short) Story"}>Short Story</MenuItem>
              <MenuItem value={"Newspaper Article"}>Newspaper Article</MenuItem>
            </Select>
            <FormHelperText>Please choose a category for your document</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <VTButton neutral onClick={handleAddClose}>
            Cancel
          </VTButton>
          <VTButton
            accept
            onClick={() => {
              if (verify()) addThisDocument();
              //else toasts.toastWarning("Please review your entries.");
            }}
          >
            Add new document
          </VTButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UploadDocument;
