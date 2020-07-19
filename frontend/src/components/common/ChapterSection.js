import React, { useState } from "react";
import { Paper, makeStyles, Typography, Grid } from "@material-ui/core";
import { IconButton, Menu, MenuItem, TextField } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { toasts } from "./AppPage/AppPage";
import { VTButton } from "../common/index";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";

const useStyles = makeStyles({
  paper: {
    paddingBottom: "3%",
  },

  title: {
    fontWeight: "lighter",
    fontSize: "18px",
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
            setAnchorEl(false);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      <div className={classes.innerContainer}>{children}</div>
      <Dialog
        open={renameDialogOpen}
        onClose={() => {
          setRenameDialogOpen(false);
        }}
        aria-labelledby="rename-section"
      >
        <VoctailDialogTitle id="rename-section">{"Rename " + title}</VoctailDialogTitle>
        <DialogContent>
          <Grid container justify="flex-start" alignItems="center" direction="column">
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <VTButton
            secondary
            onClick={() => {
              setRenameDialogOpen(false);
            }}
          >
            Cancel
          </VTButton>
          <VTButton
            success
            onClick={() => {
              if (newTitle.length < 1) {
                toasts.toastError("Please give your section a title !");
                setErrorNewTitle(true);
                return;
              }
              renameSection(newTitle);
              setRenameDialogOpen(false);
            }}
          >
            Save
          </VTButton>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ChapterSection;
