import React, { useContext } from "react";
import { Grid, Typography as T } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./common/AppPage";
import { UserContext } from "../App.js";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  text: {
    paddingTop: "5%",
    paddingBottom: "5%",
    margin: "auto",
    textAlign: "center",
    textShadow: "1px 1px",
  },
  container: { height: "100%", width: "100%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
  button: {
    textDecoration: "none",
    color: "#555",
    padding: "4px 20px 0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    width: "30%",
    height: "25%",
    borderWidth: "3px",
    "&:hover": {
      color: "white",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
});

function ClassroomsButton(props) {
  const classes = useStyles();
  return (
    <Button component={Link} to={props.to} variant="outlined" className={classes.button}>
      <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
        <T variant="h4">{props.title}</T>
        <T variant="p" align="center">
          {props.children}
        </T>
      </Grid>
    </Button>
  );
}

function Classrooms() {
  const classes = useStyles();
  const user = useContext(UserContext);

  return (
    <AppPage location="classrooms" id="classrooms-page">
      <T className={classes.text} variant="h4">
        Welcome on your classrooms dashboard {user ? user.name : ""}!
      </T>
      <Grid className={classes.text} container justify="space-evenly" alignItems="center" direction="row">
        <ClassroomsButton title="My Classrooms" to="/classrooms/saved" />
        <ClassroomsButton title="Create a new classroom" to="/classrooms/create" />
      </Grid>
    </AppPage>
  );
}

export default Classrooms;
