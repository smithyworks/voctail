import React, { useState } from "react";
import { TextField, Typography } from "@material-ui/core";

import { OkDialog } from "../common";

function AddTranslationDialog({ open, word_id, lookupWord, lookupTranslations, onSubmit, onClose }) {
  const { word } = lookupWord(word_id) ?? {};

  function _close() {
    if (typeof onClose === "function") onClose();
  }

  const [value, setValue] = useState();
  function _submit() {
    if (typeof onSubmit === "function") onSubmit(word_id, value);
  }

  const translations = lookupTranslations(word_id);
  const valid = value && value.trim() !== "" && (!translations || !translations.find((t) => t.translation === value));

  return (
    <OkDialog open={open} onClose={_close} title="Add a Translation" okText="Submit!" disabled={!valid} onOk={_submit}>
      <Typography>Contribute a translation for '{word}':</Typography>
      <TextField variant="outlined" margin="dense" onChange={(e) => setValue(e.target.value)} />
    </OkDialog>
  );
}

export default AddTranslationDialog;
