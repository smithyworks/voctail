import React, { useRef, useState } from "react";
import { api } from "../../utils";
import { toasts } from "../common/AppPage";
import { Dialog, DialogActions, DialogContent, Grid } from "@material-ui/core";
import { VTButton } from "../common";
import { makeStyles } from "@material-ui/core/styles";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";
import ErrorDialogField from "../common/Dialogs/ErrorDialogField";

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
  const minInput = 1;

  const handleClose = () => {
    onClose();
    resetFields();
  };

  const title = useRef("");
  const length = useRef("");

  const [errorTitle, setErrorTitle] = useState(false);
  const [errorLength, setErrorLength] = useState(false);

  const resetFields = () => {
    title.current = "";
    length.current = "";
  };

  const addQuiz = () => {
    const len = parseInt(length.current);
    //console.log(title.current.length > 0, length.current.length > 0, len!==NaN, len>0);
    if (verify()) {
      api.createQuiz(title.current, len).then(() => {
        toasts.toastSuccess("Random quiz added with " + len + " questions!");
        handleClose();
        onAdd();
      });
    }
  };

  function verify() {
    if (title.current.length === 0) {
      setErrorTitle(true);
      return false;
    }
    if (
      length.current.length === 0 ||
      isNaN(length.current) ||
      length.current < minInput ||
      length.current > maxInput
    ) {
      setErrorLength(true);
      return false;
    }
    return true;
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="add-custom-quiz" className={classes.dialog}>
        <VoctailDialogTitle id="add-custom-quiz">Please provide the title and length of your quiz.</VoctailDialogTitle>
        <DialogContent>
          <Grid container justify="flex-start" alignItems="left" direction="column">
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
            <ErrorDialogField
              error={errorLength}
              setError={setErrorLength}
              warning={"Please provide an appropriate length between " + minInput + " and " + maxInput + "."}
              className={classes.numberField}
              margin="dense"
              id="length"
              label="Length*"
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
          <VTButton secondary onClick={handleClose} color="primary">
            Cancel
          </VTButton>
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
