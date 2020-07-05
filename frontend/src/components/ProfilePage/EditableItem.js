import React, { useRef, useState } from "react";
import { Typography, IconButton, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import EditIcon from "@material-ui/icons/Edit";

import { ConfirmDialog } from "../common";
import { validation } from "../../utils";

const useStyles = makeStyles({
  infoItem: {
    display: "inline-block",
    width: "45%",
    margin: "10px 0",
    "& .edit-icon": { color: "lightgrey", cursor: "pointer" },
    "&:hover .edit-icon": { color: "black" },
  },
  infoItemTitle: {
    fontWeight: 300,
  },
  infoItemValue: {
    position: "relative",
    fontSize: "1.5em",
  },
  editIconContainer: {
    position: "absolute",
    display: "inline-block",
    top: -10,
    bottom: 0,
    right: 0,
    marginRight: "20px",
  },
});

function EditableItem({ title, value, onEdit, isEmail, disabled }) {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDisabled, setDialogDisabled] = useState(true);

  const newValueRef = useRef();
  function _edit() {
    setDialogOpen(false);
    if (typeof onEdit === "function") onEdit(newValueRef.current);
  }
  function _change(e) {
    const v = e.target.value;

    const validIfEmail = isEmail ? validation.validateEmail(v) : true;
    if (dialogDisabled && v && v.trim() !== "" && v !== value && validIfEmail) setDialogDisabled(false);
    else if (!dialogDisabled && (v.trim() === "" || v === value || !validIfEmail)) setDialogDisabled(true);

    newValueRef.current = e.target.value;
  }

  return (
    <div className={classes.infoItem}>
      <Typography className={classes.infoItemTitle}>{title}</Typography>
      <Typography gutterBottom className={classes.infoItemValue}>
        {value}
        {!disabled && (
          <span className={classes.editIconContainer}>
            <IconButton onClick={() => setDialogOpen(true)}>
              <EditIcon className="edit-icon" />
            </IconButton>
          </span>
        )}
      </Typography>

      {!disabled && (
        <ConfirmDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={`Enter a New ${title}`}
          onConfirm={_edit}
          disabled={dialogDisabled}
        >
          <TextField variant="outlined" onChange={_change} margin="dense" />
        </ConfirmDialog>
      )}
    </div>
  );
}

export default EditableItem;
