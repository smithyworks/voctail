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
import iconDoc from "../assets/icon_document.png";
import addSection from "../assets/addSection.png";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Header from "./common/HeaderSection";
import DashboardSection from "./common/DashboardSection";
import UserCard from "./common/UserCard";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { api } from "../utils";
import { toasts } from "./common/AppPage/AppPage";

export const dummyClassroom = {
  title: "Class of 2020",
  topic: "British History",
  description: "In this classroom I will provide material for my students to discover the ancient british history.",
  students: ["Alice", "Bob Sinclar", "Clara", "Alice", "Bob", "Clara"],
};

const currentClassroomId = urlParser();

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

function urlParser() {
  const parsed = window.location.href.split("=");
  return parsed[1];
}
function addStudents() {
  const addStudentsToThisClassroom = () => {
    api.addStudentToClassroom(10000, Math.floor(Math.random() * 30)).catch((err) => console.log(err));
  };
  addStudentsToThisClassroom();
  toasts.toastSuccess("Student added to the database!");
}

function ClassroomViewPage() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [classroomStudentsFromDatabase, setClassroomStudentsFromDatabase] = useState([]);
  const [classroomDocumentsFromDatabase, setClassroomDocumentsFromDatabase] = useState([]);
  const [allUsersFromDatabase, setAllUsersFromDatabase] = useState([]);
  const [allDocumentsFromDatabase, setAllDocumentsFromDatabase] = useState([]);
  useEffect(() => {
    api
      .getStudents(10000)
      .then((res) => {
        if (res) {
          setClassroomStudentsFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getDocuments(10000)
      .then((res) => {
        if (res) {
          setClassroomDocumentsFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getAllUsers()
      .then((res) => {
        if (res) {
          setAllUsersFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .fetchDocuments()
      .then((res) => {
        if (res) {
          setAllDocumentsFromDatabase(res.data.documents);
        }
        console.log(res.data.documents);
      })
      .catch((err) => console.log(err));
  }, []);

  let registeredStudentIds = [];
  for (let id of classroomStudentsFromDatabase) {
    registeredStudentIds.push(id.user_id);
  }
  let registeredDocumentIds = [];
  for (let id of classroomDocumentsFromDatabase) {
    registeredDocumentIds.push(id.document_id);
  }

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

      <DashboardSection
        title="Students"
        description="Add students to share your material and get started."
        Button={
          <IconButton aria-label="test" onClick={addStudents}>
            <AddBoxIcon fontSize="large" style={{ color: "darkblue" }} />
          </IconButton>
        }
      >
        <Grid container>
          {classroomStudentsFromDatabase.map((member) => {
            return (
              <Grid item style={{ padding: "10px" }}>
                <UserCard name={member.name} email={member.email} avatar={iconUser} tip={"Freemium"} />
              </Grid>
            );
          })}
        </Grid>
      </DashboardSection>

      <DashboardSection
        title="Sections"
        description="Organize your classroom in several sections."
        Button={
          <IconButton aria-label="test">
            <AddBoxIcon fontSize="large" style={{ color: "darkblue" }} />
          </IconButton>
        }
      >
        <Grid container>
          {dummyClassroom.students.map((member) => {
            return (
              <Grid item style={{ padding: "10px" }}>
                <img src={iconDoc} className={classes.logo} alt="VocTail" />
              </Grid>
            );
          })}
        </Grid>
      </DashboardSection>
    </AppPage>
  );
}

export default ClassroomViewPage;
