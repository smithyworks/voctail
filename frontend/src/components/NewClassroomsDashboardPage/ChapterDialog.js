import React, { useState } from "react";
import { CreationDialog } from "../common";
import { Typography } from "@material-ui/core";
import ErrorDialogField from "../common/Dialogs/ErrorDialogField";

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
      <ErrorDialogField
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
