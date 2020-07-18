import React, { useState, useRef } from "react";
import { Paper, makeStyles, Grid, Typography, Menu, MenuItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { getColor } from "./Quiz/colorCycler";
import { api } from "../../utils";
import { ConfirmDialog } from "../common";

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

function teacherData(user_id, classroomAuthor, setClassroomAuthor) {
  api
    .user(user_id)
    .then((res) => {
      setClassroomAuthor(res.data.name);
    })
    .catch((err) => console.log(err));
  return classroomAuthor;
}

function indexOfClassroom(classroomId, classrooms) {
  let output = 0;
  classrooms.forEach((classroom, index) => {
    if (classroom.classroom_id === classroomId) {
      output = index;
    }
  });
  return output;
}

function ClassroomTile({
  title,
  id,
  teacher,
  topic,
  isOwned,
  onDelete,
  onEdit,
  linkTo,
  classroomId,
  classroomDataFromDatabase,
  setClassroomDataFromDatabase,
}) {
  const classes = useStyles();
  const backgroundColor = getColor(`classroom-${id}`);

  const [hovered, setHovered] = useState(false);
  const [classroomAuthor, setClassroomAuthor] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const anchor = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  function openMenu(e) {
    setMenuOpen(true);
    e.preventDefault();
    e.stopPropagation();
  }

  function _onEdit(e) {
    if (typeof onDelete === "function") {
      onEdit(e);
      setMenuOpen(false);
    }
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
              {"Open by " + teacherData(teacher, classroomAuthor, setClassroomAuthor)}
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

      <ConfirmDialog
        open={confirmDialogOpen}
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

      <Menu anchorEl={anchor.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuItem onClick={_onEdit}>Rename</MenuItem>
        <MenuItem onClick={() => setConfirmDialogOpen(true)}>Delete</MenuItem>
      </Menu>
    </Grid>
  );
}

export default ClassroomTile;
