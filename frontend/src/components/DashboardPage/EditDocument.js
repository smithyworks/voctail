import React, { useRef, useState } from "react";
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

function EditDocument(refresh, documentId, title, author, description, isPublic, currentCategory) {
  const titleInput = useRef(title);
  const authorInput = useRef(author);
  const descriptionInput = useRef(description);
  const [publicDocument, setPublicDocument] = useState(isPublic);
  const [category, setCategory] = useState(currentCategory);

  const [open, setOpen] = useState(true);
  const classes = useStyles();

  const handleEditOpen = () => {
    setOpen(true);
  };
  const handleEditClose = () => {
    setOpen(false);
  };
  const handleStatusChange = (event) => {
    setPublicDocument(event.target.checked);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  //verify the metadata and the document for the upload to prevent false uploads
  function verify() {
    if (titleInput.current.length <= 1) {
      toasts.toastWarning("The title cannot be empty.");
      return false;
    }
    if (authorInput.current.length <= 1) {
      toasts.toastWarning("The author cannot be empty.");
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
  }

  const editThisDocument = () => {
    api
      .editDocument(
        documentId,
        titleInput.current,
        authorInput.current,
        descriptionInput.current,
        category,
        publicDocument
      )
      .then(() => {
        handleEditClose();
        refresh();
        toasts.toastSuccess("The document was successfully edited!");
        resetValues();
      })
      .catch((err) => {
        console.log(err);
        toasts.toastError("Error editing the document!");
      });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleEditClose} aria-labelledby="edit-document">
        <DialogTitle id="edit-document">Edit your document</DialogTitle>
        <DialogContent>
          <DialogContentText>You can change the additional information of your document.</DialogContentText>
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
          <VTButton neutral onClick={handleEditClose}>
            Cancel
          </VTButton>
          <VTButton
            accept
            onClick={() => {
              verify();
              if (verify()) editThisDocument();
              //else toasts.toastWarning("Please review your entries.");
            }}
          >
            Save changes
          </VTButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditDocument;
