import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "./common/AppPage";

import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import TextField from "@material-ui/core/TextField";

import Container from "@material-ui/core/Container";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import addMember from "../assets/addMember.png";
import addSection from "../assets/addScetion.png";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Header from "./common/HeaderSection";

export const dummyClassroom = {
  title: "Class of 2020",
  topic: "British History",
  description: "In this classroom I will provide material for my students to discover the ancient british history.",
  students: ["Alice", "Bob", "Clara"],
};

const useStyles = makeStyles((theme) => ({
  headUpText: {
    margin: "auto",
    textAlign: "center",
    fontStyle: "italic",
  },

  containerWithoutMargin: {
    backgroundColor: "#D4E4E4",
    paddingTop: "3%",
    paddingBottom: "3%",
  },

  title: {
    flexGrow: 1,
  },

  logo: {
    height: "60px",
    margin: "5px 0",
  },

  appBar: {
    borderColor: "black",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ClassroomViewPage() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <AppPage location="classrooms" id="classrooms-page">
      <Header
        mainTitle={dummyClassroom.title}
        subtitle={dummyClassroom.topic}
        description={dummyClassroom.description}
      />

      <AppBar position="static" color="white">
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            Students
          </Typography>
          <Typography className={classes.headUpText} algin="center" color="inherit">
            Add students to share your material and get started.
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.containerWithoutMargin} maxWidth="xl">
        <Button onClick={handleClick}>
          <img src={addMember} className={classes.logo} alt="VocTail" />
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="info">
            You will be soon able to add a member!
          </Alert>
        </Snackbar>
      </Container>

      <AppBar className={classes.appBar} position="static" color="white">
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            Sections
          </Typography>
          <Typography className={classes.headUpText} algin="center" color="inherit">
            Organize your classroom in several sections and upload your documents in a specific section.
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.containerWithoutMargin} maxWidth="xl">
        <Button onClick={handleClick}>
          <img src={addSection} className={classes.logo} alt="VocTail" />
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="info">
            You will be soon able to add a section!
          </Alert>
        </Snackbar>
      </Container>
    </AppPage>
  );
}

export default ClassroomViewPage;
