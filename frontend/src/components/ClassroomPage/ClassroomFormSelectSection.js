import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VTButton from "../common/Buttons/VTButton";
import DialogContentText from "@material-ui/core/DialogContentText";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";

const formStyles = makeStyles(() => ({
  header: {
    color: "#0B6374",
    backgroundColor: "#D4E4E4",
  },
  description: {
    marginTop: "5%",
    marginBottom: "5%",
    fontStyle: "italic",
    textAlign: "center",
  },
  textField: {
    marginBottom: "3%",
  },
  buttons: { margin: "1%" },
}));

const names = ["Chapter 1", "Chapter 2"];

function ClassroomFromSelectSection({ openCreateForm, closeCreateForm }) {
  const classes = formStyles();
  const [personName, setPersonName] = useState([]);
  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setPersonName(value);
  };

  return (
    <div>
      <Dialog open={openCreateForm} onClose={closeCreateForm} aria-labelledby="form-dialog-title">
        <VoctailDialogTitle id="form-dialog-title"> Adding a New document </VoctailDialogTitle>
        <DialogContent>
          <DialogContentText className={classes.description}>
            {" "}
            Select a section to add your document.{" "}
          </DialogContentText>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-name-label">Name</InputLabel>
            <Select
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              multiple
              value={personName}
              onChange={handleChange}
              input={<Input />}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <VTButton
            danger
            style={{ margin: "1%" }}
            onClick={() => {
              closeCreateForm();
            }}
          >
            Cancel
          </VTButton>
          <VTButton accept style={{ margin: "1%" }}>
            Add
          </VTButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ClassroomFromSelectSection;
