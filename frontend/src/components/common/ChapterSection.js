import React, { useState } from "react";
import { Paper, makeStyles, Typography, Divider, Grid } from "@material-ui/core";
import { IconButton, Menu, MenuItem, TextField } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CreationDialog from "./Dialogs/CreationDialog";
import { toasts } from "./AppPage/AppPage";

const useStyles = makeStyles({
  paper: {
    paddingBottom: "3%",
  },

  innerContainer: {
    padding: "3px 20px 8px 20px",
  },

  expansionIcon: {
    fontSize: "20px",
    marginBottom: "-5px",
  },

  buttonPosition: {
    position: "flexible",
    marginLeft: "initial",
    marginTop: "-5px",
  },
});

function ChapterSection({ title, children, renameSection, deleteSection }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [errorNewTitle, setErrorNewTitle] = useState(false);

  const handleChangeNewTitle = (event) => {
    setNewTitle(event.target.value);
    if (errorNewTitle || newTitle > 0) {
      setErrorNewTitle(false);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper elevation={0} className={classes.paper}>
      <Grid container justify="space-between" direction="row" alignItems="center">
        <Grid style={{ paddingLeft: "10px" }}>
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          {
            <IconButton aria-label="test" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
        </Grid>
      </Grid>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            setRenameDialogOpen(true);
            setAnchorEl(false);
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteSection();
            console.log("click");
            setAnchorEl(false);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      <Divider />
      <div className={classes.innerContainer}>{children}</div>
      <CreationDialog
        open={renameDialogOpen}
        title={"Renaming " + title + "..."}
        description={"Provide a new title below"}
        validationButtonName="Save"
        onConfirm={() => {
          if (newTitle.length < 1) {
            toasts.toastError("Please give your section a title !");
            setErrorNewTitle(true);
            return;
          }
          renameSection(newTitle);
          setRenameDialogOpen(false);
        }}
        onClose={() => {
          setRenameDialogOpen(false);
        }}
      >
        <TextField
          required
          error={errorNewTitle}
          className={classes.textField}
          autoFocus
          value={newTitle}
          onChange={handleChangeNewTitle}
          margin="dense"
          id="name"
          label="New Title"
          type="text"
          fullWidth
        />
      </CreationDialog>
    </Paper>
  );
}

export default ChapterSection;
