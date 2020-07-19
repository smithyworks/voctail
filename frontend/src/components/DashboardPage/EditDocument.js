import React, { useEffect, useRef, useState } from "react";
import { toasts } from "../common/AppPage";
import { api } from "../../utils";
import VTButton from "../common/Buttons/VTButton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";
import VoctailCheckbox from "../common/VoctailCheckbox";
import ErrorDialogField from "../common/Dialogs/ErrorDialogField";

const useStyles = makeStyles(() => ({
  container: { height: 200, width: "100%" },
  grid: { height: 100, width: "100%" },
  userItem: { width: "150px" },
}));

function EditDocument({ refresh, open, onClose, documentId, title, author, isPublic, currentCategory }) {
  const titleInput = useRef("");
  const authorInput = useRef("");
  const [publicDocument, setPublicDocument] = useState(false);
  const [category, setCategory] = useState(null);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorAuthor, setErrorAuthor] = useState(false);

  const classes = useStyles();
  useEffect(() => {
    titleInput.current = title;
    authorInput.current = author;
  }, [open]);

  useEffect(() => {
    setPublicDocument(isPublic);
    setCategory(currentCategory);
  }, [isPublic, currentCategory]);

  const handleStatusChange = (event) => {
    setPublicDocument(event.target.checked);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  //verify the metadata and the document for the upload to prevent false uploads
  function verify() {
    if (titleInput.current.length <= 1) {
      setErrorTitle(true);
      toasts.toastWarning("The title cannot be empty.");
      return false;
    }
    if (authorInput.current.length <= 1) {
      setErrorAuthor(true);
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
  }

  const editThisDocument = () => {
    api
      .editDocument(documentId, titleInput.current, authorInput.current, category, publicDocument)
      .then(() => {
        onClose();
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
      <Dialog open={open} onClose={onClose} aria-labelledby="edit-document">
        <VoctailDialogTitle id="edit-document">Edit your document</VoctailDialogTitle>
        <DialogContent>
          <DialogContentText>You can change the additional information of your document.</DialogContentText>
          <ErrorDialogField
            autoFocus
            margin="dense"
            id="title"
            label="Title*"
            type="title"
            error={errorTitle}
            setError={setErrorTitle}
            defaultValue={titleInput.current}
            onChange={(e) => {
              titleInput.current = e.target.value;
              setErrorTitle(false);
            }}
            fullWidth
          />
          <ErrorDialogField
            autoFocus
            margin="dense"
            id="author"
            label="Author*"
            type="author"
            error={errorAuthor}
            setError={setErrorAuthor}
            defaultValue={authorInput.current}
            onChange={(e) => {
              authorInput.current = e.target.value;
              setErrorAuthor(false);
            }}
            fullWidth
          />

          <DialogContentText />

          <FormControl className={classes.formControl}>
            <InputLabel shrink id="choose-category">
              Category
            </InputLabel>
            <Select
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

          <DialogContentText />

          <FormControlLabel
            control={
              <VoctailCheckbox
                name="checkedH"
                onChange={handleStatusChange}
                checked={publicDocument}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
            label="Public Document"
          />
        </DialogContent>
        <DialogActions>
          <VTButton secondary onClick={onClose}>
            Cancel
          </VTButton>
          <VTButton
            neutral
            onClick={() => {
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
