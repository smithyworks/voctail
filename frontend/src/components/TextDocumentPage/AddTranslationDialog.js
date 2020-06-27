import React, { useRef } from "react";
import {
  Typography as T,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  title: {
    display: "flex",
    alignItems: "flex-end",
  },
  titleSpan: { marginBottom: "-6px" },
  icon: { marginRight: "5px", fontSize: "30px" },
  confirmTitle: {
    marginTop: "5px",
    marginBottom: "-5px",
  },
});

function AddTranslationDialog({ open, word_id, vocabulary, translations, onSubmit, onClose }) {
  const classes = useStyles();

  const word = vocabulary?.find((v) => v.word_id === word_id)?.word;

  function _close() {
    if (typeof onClose === "function") onClose();
  }

  const valueRef = useRef();
  function _submit() {
    if (typeof onSubmit === "function") onSubmit(word_id, valueRef.current);
  }

  return (
    <Dialog open={open} onClose={_close}>
      <DialogTitle disableTypography>
        <T variant="h6" className={classes.title}>
          <span className={classes.titleSpan}>Contribute a translation!</span>
        </T>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Add a translation for the word '{word}':</DialogContentText>
        <TextField variant="outlined" margin="dense" onChange={(e) => (valueRef.current = e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={_submit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTranslationDialog;
