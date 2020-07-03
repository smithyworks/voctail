//This page will be used to test components

import React, { useState, useEffect, useRef } from "react";
import { Grid, Typography, ButtonBase, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "../index.css";
import AppPage from "./common/AppPage";
import MuiAlert from "@material-ui/lab/Alert";
import { api } from "../utils";
import userLogo from "../images/user.png";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

const useStyles = makeStyles((theme) => ({
  headUpText: {
    margin: "auto",
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    margin: "5%",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    borderWidth: "3px",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  logo: {
    height: "40px",
    margin: "10px 10px",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function HeadUpText(props) {
  const classes = useStyles();
  return <Typography className={classes.headUpText}>{props.text}</Typography>;
}

function ClassroomsCreatePage({ ...props }) {
  const classes = useStyles();
  const [classroomStudentsFromDatabase, setClassroomStudentsFromDatabase] = useState(null);

  useEffect(() => {
    api
      .getStudents(1)
      .then((res) => {
        if (res) {
          setClassroomStudentsFromDatabase(res.data.rows);
        }
        console.log(classroomStudentsFromDatabase);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AppPage location="classrooms" id="classrooms-page">
      <HeadUpText text="This page is used for testing." />
      <Grid cellHeight={140} className={classes.gridList} direction="column">
        {[0, 1, 2].map((tile) => (
          <Grid item>
            <img className={classes.logo} src={userLogo} alt="user logo" />
          </Grid>
        ))}
        <Grid>
          <Button variant="contained" className={classes.button} onClick={() => alert("click")} color="primary">
            Add student
          </Button>
        </Grid>
      </Grid>
    </AppPage>
  );
}

export default ClassroomsCreatePage;
