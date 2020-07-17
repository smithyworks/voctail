import React, { useRef, useState } from "react";
import { api } from "../../utils";
import { toasts } from "../common/AppPage";
import { Button, Dialog, DialogActions, DialogContent, Grid } from "@material-ui/core";
import { VTButton } from "../common";
import VoctailDialogTitle from "../common/VoctailDialogTitle";
import ErrorDialogField from "./ErrorDialogField";

function RenameQuiz({ onAdd, onClose, open, quiz_id }) {
  const handleClose = () => {
    onClose();
    resetFields();
  };

  const title = useRef("");
  const [errorTitle, setErrorTitle] = useState(false);

  const resetFields = () => {
    title.current = "";
  };

  const renameQuiz = () => {
    if (verify()) {
      api.renameQuiz(quiz_id, title.current).then((r) => {
        if (r) {
          toasts.toastSuccess("Quiz renamed.");
        }
      });
      onAdd();
      handleClose();
    }
  };

  function verify() {
    if (title.current.length === 0) {
      setErrorTitle(true);
      return false;
    }
    return true;
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="add-custom-quiz">
        <VoctailDialogTitle id="add-custom-quiz">Please provide a new title for renaming.</VoctailDialogTitle>
        <DialogContent>
          <Grid container justify="flex-start" alignItems="center" direction="column">
            <ErrorDialogField
              error={errorTitle}
              setError={setErrorTitle}
              warning={"Please provide a title."}
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
