import React, { useRef } from "react";
import { api } from "../../utils";
import { toasts } from "../common/AppPage";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@material-ui/core";
import { VTButton } from "../common";
import Input from "@material-ui/core/Input";

function AddRandomQuiz({ onAdd, onClose, open }) {
  const handleClose = () => {
    onClose();
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
        handleClose();
        onAdd();
      });
    } else {
      toasts.toastError("You cannot add a quiz without title or length.");
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="add-custom-quiz">
        <DialogTitle id="add-custom-quiz">Please provide the title and length of your quiz.</DialogTitle>
        <DialogContent>
          <Grid container justify="flex-start" alignItems="left" direction="column">
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title*"
              type="title"
              onChange={(e) => (title.current = e.target.value)}
              fullWidth
            />
            <Input
              margin="dense"
              id="length"
              label="Length*"
              onChange={(e) => (length.current = e.target.value)}
              inputProps={{
                step: 1,
                min: 0,
                max: 1000,
                type: "number",
              }}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
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
