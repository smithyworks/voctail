import React, { useRef } from "react";
import { api } from "../../utils";
import { toasts } from "../common/AppPage";
import { Button, Dialog, DialogActions, DialogContent, Grid, TextField } from "@material-ui/core";
import { VTButton } from "../common";
import VoctailDialogTitle from "../common/VoctailDialogTitle";

function RenameQuiz({ onAdd, onClose, open, quiz_id }) {
  const handleClose = () => {
    onClose();
    resetFields();
  };

  const title = useRef("");

  const resetFields = () => {
    title.current = "";
  };

  const renameQuiz = () => {
    if (title.current.length > 0) {
      api.renameQuiz(quiz_id, title.current).then((r) => {
        if (r) {
          toasts.toastSuccess("Quiz renamed.");
        }
      });
      onAdd();
      handleClose();
    } else {
      toasts.toastError("Please insert a title first.");
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="add-custom-quiz">
        <VoctailDialogTitle id="add-custom-quiz">Please provide a new title for renaming.</VoctailDialogTitle>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <VTButton
            success
            onClick={() => {
              renameQuiz();
            }}
            color="primary"
          >
            Rename
          </VTButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RenameQuiz;
