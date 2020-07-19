import React, { useState } from "react";
import { CreationDialog } from "../common";
import { TextField, Typography } from "@material-ui/core";

function ChapterDialog({ title, open, onClose, onSubmit }) {
  const [value, setValue] = useState();

  return (
    <CreationDialog
      title={title}
      open={open}
      onClose={onClose}
      onConfirm={() => onSubmit(value)}
      disabled={!value || value.trim() === ""}
    >
      <Typography style={{ paddingTop: "10px" }}>Create a new chapter</Typography>
      <TextField
        placeholder="Chaper name..."
        margin="dense"
        variant="outlined"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </CreationDialog>
  );
}

export default ChapterDialog;
