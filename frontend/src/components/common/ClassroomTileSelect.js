import React, { useState, useContext } from "react";
import { Paper, makeStyles, Grid, Typography } from "@material-ui/core";
import { getColor } from "./Quiz/colorCycler";
import { api } from "../../utils";
import { UserContext } from "../../App";

const useStyles = makeStyles({
  container: {
    padding: "10px",
  },
  paper: {
    width: "100%",
    height: "100px",
    position: "relative",
    cursor: "pointer",
    display: "inline-block",
    overflow: "hidden",
    color: "white",
    textDecoration: "none",
    padding: "10px 20px 10px 20px",
  },
  name: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bolder",
    height: "30px",
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
    //padding: "20px 0",
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

function ClassroomTileSelect({ title, id, teacher, topic, onClick }) {
  const user = useContext(UserContext);
  const classes = useStyles();
  const backgroundColor = getColor(`classroom-${id}`);

  const [hovered, setHovered] = useState(false);
  const [classroomAuthor, setClassroomAuthor] = useState("");
  return (
    <Grid item className={classes.container}>
      <Paper
        className={classes.paper}
        style={{ backgroundColor }}
        elevation={hovered ? 5 : 2}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
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
              {"Open by " + teacherData(user, teacher, classroomAuthor, setClassroomAuthor)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default ClassroomTileSelect;
