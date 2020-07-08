import React, { useRef, useState } from "react";
import { api } from "../../../utils";
import { toasts } from "../../common/AppPage";
import IconButton from "@material-ui/core/IconButton";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@material-ui/core";
import { VTButton } from "../../common";

function AddRandomQuiz({ onAdd }) {
  const [open, setOpen] = useState(false);
  const handleAddOpen = () => {
    setOpen(true);
  };
  const handleAddClose = () => {
    setOpen(false);
    resetFields();
  };

  const title = useRef("");
  const length = useRef("");

  const resetFields = () => {
    title.current = "";
    length.current = "";
  };

  const addQuiz = () => {
    const len = parseInt(length.current);
    //console.log(title.current.length > 0, length.current.length > 0, len!==NaN, len>0);
    if (title.current.length > 0 && length.current.length > 0 && !isNaN(len) && len > 0) {
      api.createQuiz(title.current, len).then(() => {
        toasts.toastSuccess("Random quiz added with " + len + " questions!");
        handleAddClose();
        onAdd();
      });
    } else {
      toasts.toastError("You cannot add a quiz without title or length.");
    }
  };

  return (
    <div>
      <IconButton onClick={handleAddOpen}>
        <LibraryAddIcon />
      </IconButton>
      <Dialog open={open} onClose={handleAddClose} aria-labelledby="add-custom-quiz">
        <DialogTitle id="add-custom-quiz">Please provide the title and length of your quiz.</DialogTitle>
        <DialogContent>
          <Grid container justify="flex-start" alignItems="center" direction="column">
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title*"
              type="title"
              onChange={(e) => (title.current = e.target.value)}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="length"
              label="Length*"
              type="length"
              onChange={(e) => (length.current = e.target.value)}
              fullWidth
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            Cancel
          </Button>
          <VTButton
            success
            onClick={() => {
              addQuiz();
            }}
            color="primary"
          >
            Add quiz
          </VTButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddRandomQuiz;
