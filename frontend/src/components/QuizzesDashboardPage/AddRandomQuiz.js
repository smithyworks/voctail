import React, { useRef } from "react";
import { api } from "../../utils";
import { toasts } from "../common/AppPage";
import { Button, Dialog, DialogActions, DialogContent, Grid, TextField } from "@material-ui/core";
import { VTButton } from "../common";
import Input from "@material-ui/core/Input";
import { makeStyles } from "@material-ui/core/styles";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";

const useStyles = makeStyles({
  numberField: {
    width: "30%",
    height: "100%",
    paddingTop: "30px",
  },
  dialog: {
    padding: "30px",
  },
});

function AddRandomQuiz({ onAdd, onClose, open }) {
  const classes = useStyles();

  const maxInput = 100;
  const minInput = 0;

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
    if (title.current.length > 0 && length.current.length > 0 && !isNaN(len) && len >= minInput && len <= maxInput) {
      api.createQuiz(title.current, len).then(() => {
        toasts.toastSuccess("Random quiz added with " + len + " questions!");
        handleClose();
        onAdd();
      });
    } else {
      toasts.toastError("You cannot add a quiz without title or length between " + minInput + " and " + maxInput + ".");
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="add-custom-quiz" className={classes.dialog}>
        <VoctailDialogTitle id="add-custom-quiz">Please provide the title and length of your quiz.</VoctailDialogTitle>
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
              className={classes.numberField}
              margin="dense"
              id="length"
              placeholder="Length*"
              onChange={(e) => (length.current = e.target.value)}
              inputProps={{
                step: 1,
                min: { minInput },
                max: { maxInput },
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
