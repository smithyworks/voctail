import React, { useRef, useState, useEffect } from "react";
import { toasts } from "../common/AppPage";
import { api } from "../../utils";
import VTButton from "../common/Buttons/VTButton";
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

function UploadDocument({ refresh, publisherId, handleAddClose, open }) {
  const titleInput = useRef("");
  const authorInput = useRef("");
  const descriptionInput = useRef("");
  const blocksInput = useRef([]);
  const [publicDocument, setPublicDocument] = useState(true);
  const contentInput = useRef("");
  const blocks = [];
  const [documentLoaded, setDocumentLoaded] = useState(false);

  //const imageInput = useRef(); todo use image
  const [category, setCategory] = useState("");
  const classes = useStyles();
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorAuthor, setErrorAuthor] = useState(false);

  const handleStatusChange = (event) => {
    setPublicDocument(event.target.checked);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  //read uploaded file and stringify it for the database (format in blocks, see more in the schema)
  function readFile() {
    const uploadedFile = document.getElementById("upload-file").files[0];

    let reader = new FileReader();
    reader.readAsText(uploadedFile);

    let currentType;
    let currentContent;
    reader.onloadend = function () {
      const lines = reader.result.split(/\r?\n/);

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

          // return; // no need to check for other block types
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
      blocksInput.current = blocks;
      setDocumentLoaded(true);
    };
  }
  //verify the metadata and the document for the upload to prevent false uploads
  function verify() {
    if (titleInput.current.length <= 1) {
      setErrorTitle(true);
      toasts.toastWarning("Please insert the title before uploading your document.");
      return false;
    }
    if (authorInput.current.length <= 1) {
      setErrorAuthor(true);
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
    return true;
  }

  function resetValues() {
    setPublicDocument(true);
    setCategory("");
    titleInput.current = "";
    authorInput.current = "";
    descriptionInput.current = "";
    contentInput.current = "";
    setDocumentLoaded(false);
  }

  //add this document after reading the file with the file reader (use effects gets triggered by the documentLoaded which is activated in readFile()
  async function addThisDocument() {
    //todo
    if (documentLoaded) {
      api
        .addDocument(
          publisherId,
          titleInput.current,
          authorInput.current,
          descriptionInput.current,
          category,
          publicDocument,
          contentInput.current,
          blocksInput.current
        )
        .then(() => {
          handleAddClose();
          refresh();
          toasts.toastSuccess("The document was successfully added!");
          resetValues();
        })
        .catch((err) => {
          console.log(err);
          toasts.toastError("Error uploading the document!");
        });
    } else {
      toasts.toastWarning("Are you sure?");
    }
  }

  useEffect(() => {
    addThisDocument();
  }, [documentLoaded]);

  return (
    <div>
      <Dialog open={open} onClose={handleAddClose} aria-labelledby="add-new-document">
        <DialogTitle id="add-new-document">Add document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title*"
            type="title"
            error={errorTitle}
            onChange={(e) => {
              titleInput.current = e.target.value;
              setErrorTitle(false);
            }}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="author"
            label="Author*"
            type="author"
            error={errorAuthor}
            onChange={(e) => {
              authorInput.current = e.target.value;
              setErrorAuthor(false);
            }}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            multiline
            rows={3}
            type="description"
            onChange={(e) => (descriptionInput.current = e.target.value)}
            fullWidth
          />

          <FormControl className={classes.formControl}>
            <InputLabel shrink id="choose-category">
              Category
            </InputLabel>
            <Select
              id="choose-category"
              onChange={handleCategoryChange}
              displayEmpty
              className={classes.selectEmpty}
              value={category}
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
          <DialogContentText />

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
          <DialogContentText>
            Your document is public and available to all users. If you want to keep your document private please
            deactivate the status.
          </DialogContentText>

          <input accept="txt/*" className={classes.input} id="upload-file" multiple type="file" />
          <label htmlFor="upload-text">
            <VTButton secondary component="span" startIcon={<DescriptionIcon />}>
              Upload .txt
            </VTButton>
          </label>
        </DialogContent>
        <DialogActions>
          <VTButton neutral onClick={handleAddClose}>
            Cancel
          </VTButton>
          <VTButton
            accept
            onClick={() => {
              if (verify()) {
                readFile();
              }
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
