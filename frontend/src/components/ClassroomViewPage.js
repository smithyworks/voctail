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
import iconUser from "../assets/icon_user.png";
import addSection from "../assets/addSection.png";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Header from "./common/HeaderSection";
import DashboardSection from "./common/DashboardSection";
import UserCard from "./common/UserCard";

export const dummyClassroom = {
  title: "Class of 2020",
  topic: "British History",
  description: "In this classroom I will provide material for my students to discover the ancient british history.",
  students: ["Alice", "Bob", "Clara", "Alice", "Bob", "Clara"],
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

      <DashboardSection title="Students" description="Add students to share your material and get started.">
        <Grid container>
          {dummyClassroom.students.map((member) => {
            return (
              <Grid item style={{ padding: "10px" }}>
                <UserCard name={member} email={member + "@voctail.com"} avatar={iconUser} />
              </Grid>
            );
          })}
          <Grid item style={{ padding: "10px" }}>
            <Button onClick={handleClick}>
              <img src={addMember} className={classes.logo} alt="VocTail" />
            </Button>
          </Grid>
        </Grid>
      </DashboardSection>

      <DashboardSection
        title="Sections"
        description="Organize your classroom in several sections and upload your documents in a specific section."
      >
        <Grid container>
          {dummyClassroom.students.map((member) => {
            return (
              <Grid item style={{ padding: "10px" }}>
                <img src={addMember} className={classes.logo} alt="VocTail" />
              </Grid>
            );
          })}
          <Grid item style={{ padding: "10px" }}>
            <Button onClick={handleClick}>
              <img src={addMember} className={classes.logo} alt="VocTail" />
            </Button>
          </Grid>
        </Grid>
      </DashboardSection>
    </AppPage>
  );
}

export default ClassroomViewPage;
