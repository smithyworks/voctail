import React, { useState, useRef, useContext } from "react";
import { Paper, makeStyles, Grid, Typography, Menu, MenuItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { getColor } from "./Quiz/colorCycler";
import { api } from "../../utils";
import { toasts } from "./AppPage/AppPage";
import ConfirmDialog from "./Dialogs/ConfirmDialog";
import { UserContext } from "../../App";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { VTButton } from "../common/index";
import VoctailDialogTitle from "../common/Dialogs/VoctailDialogTitle";
import WarningDialog from "../AdminPage/WarningDialog";
import ErrorDialogField from "./Dialogs/ErrorDialogField";

const useStyles = makeStyles({
  container: {
    padding: "10px",
  },
  paper: {
    width: "100%",
    height: "175px",
    position: "relative",
    cursor: "pointer",
    display: "inline-block",
    overflow: "hidden",
    color: "white",
    textDecoration: "none",
    padding: "40px 20px 10px 20px",
  },
  name: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bolder",
    height: "70px",
    lineHeight: "1.3em",
  },
  menuIconContainer: {
    display: "inline-block",
    position: "absolute",
    top: "0",
    padding: "5px 2px 1px 2px",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderBottomLeftRadius: 4,
    "&:hover": {
      backgroundColor: "black",
    },
  },
  menuIconIn: {
    right: "0",
    transition: "right 300ms",
  },
  menuIconOut: {
    right: "-30px",
    transition: "right 400ms",
  },
  progressContainer: {
    padding: "20px 0",
  },
  progress: {
    height: "7px",
    border: "1px solid white",
    borderRadius: "3px",
    backgroundColor: "transparent",
  },
  progressBar: {
    backgroundColor: "white",
  },
  infoTextContainer: { paddingTop: "10px" },
  progressText: {
    fontWeight: "lighter",
  },
  teacher: { fontWeight: "lighter", fontStyle: "italic" },
});

function teacherData(user, user_id, classroomAuthor, setClassroomAuthor) {
  if (user.user_id === user_id) {
    return "you";
  }
  api
    .user(user_id)
    .then((res) => {
      setClassroomAuthor(res.data.name);
    })
    .catch((err) => console.log(err));
  return classroomAuthor;
}

function ClassroomTile({ title, id, teacher, topic, isOwned, onDelete, onRename, linkTo }) {
  const user = useContext(UserContext);
  const classes = useStyles();
  const backgroundColor = getColor(`classroom-${id}`);

  const [hovered, setHovered] = useState(false);
  const [classroomAuthor, setClassroomAuthor] = useState("");
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

  const anchor = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  function openMenu(e) {
    setMenuOpen(true);
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <Grid item xs={12} sm={6} md={3} lg={3} className={classes.container}>
      <Paper
        className={classes.paper}
        style={{ backgroundColor }}
        elevation={hovered ? 5 : 2}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        component={Link}
        to={linkTo}
      >
        <Grid container direction="column" justify="space-between">
          <Grid item>
            <Typography className={classes.name}>{title}</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.progressText}>{topic}</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.teacher}>
              {"Created by " + teacherData(user, teacher, classroomAuthor, setClassroomAuthor)}
            </Typography>
          </Grid>
        </Grid>

        {!!isOwned && (
          <div
            className={`${classes.menuIconContainer} ${hovered ? classes.menuIconIn : classes.menuIconOut}`}
            onClick={openMenu}
            ref={anchor}
          >
            <MoreVertIcon />
          </div>
        )}
      </Paper>

      <WarningDialog
        open={confirmDialogOpen}
        info={{
          title: "You are about to delete a document forever!",
          body: `Are you sure you want to delete the classroom "${title}" created by ${teacherData(
            user,
            teacher,
            classroomAuthor,
            setClassroomAuthor
          )}?`,
          confirmText: title,
          onClose: () => {
            onDelete();
            setConfirmDialogOpen(false);
          },
        }}
      />

      <ConfirmDialog
        open={false}
        title="Deleting a classroom..."
        onConfirm={() => {
          onDelete();
          setConfirmDialogOpen(false);
        }}
        onClose={() => {
          setConfirmDialogOpen(false);
        }}
      >
        <Grid container>
          <Grid element>
            <Typography> Are you sure you want to delete</Typography>
          </Grid>
          <Grid element>
            <Typography style={{ color: "red", marginLeft: "5px", marginRight: "5px", fontWeight: "bold" }}>
              {" " + title}
            </Typography>
          </Grid>
          <Grid element>
            <Typography>?</Typography>
          </Grid>
        </Grid>
      </ConfirmDialog>

      <Dialog
        open={renameDialogOpen}
        onClose={() => {
          setRenameDialogOpen(false);
        }}
        aria-labelledby="rename-classroom"
      >
        <VoctailDialogTitle id="rename-classroom">{"Rename " + title}</VoctailDialogTitle>
        <DialogContent>
          <Grid container justify="flex-start" alignItems="center" direction="column">
            <ErrorDialogField
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
                toasts.toastError("Please give your classroom a title !");
                setErrorNewTitle(true);
                return;
              }
              onRename(newTitle);
              setRenameDialogOpen(false);
            }}
          >
            Save
          </VTButton>
        </DialogActions>
      </Dialog>

      <Menu anchorEl={anchor.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuItem
          onClick={() => {
            setRenameDialogOpen(true);
            setMenuOpen(false);
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            setConfirmDialogOpen(true);
            setMenuOpen(false);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Grid>
  );
}

export default ClassroomTile;
