import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "./common/AppPage";

import iconUser from "../assets/icon_user.png";
import iconDoc from "../assets/icon_document.png";

import Header from "./common/HeaderSection";
import DashboardSection from "./common/DashboardSection";
import UserCard from "./common/UserCard";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { api } from "../utils";
import { toasts } from "./common/AppPage/AppPage";

const currentClassroomId = urlParser();

const useStyles = makeStyles(() => ({
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
    api.addStudentToClassroom(currentClassroomId, Math.floor(Math.random() * 30)).catch((err) => console.log(err));
  };
  addStudentsToThisClassroom();
  toasts.toastSuccess("Student added to the database!");
}

function ClassroomViewPage() {
  const classes = useStyles();
  const [classroomDataFromDatabase, setClassroomDataFromDatabase] = useState([]);
  const [classroomStudentsFromDatabase, setClassroomStudentsFromDatabase] = useState([]);
  const [classroomDocumentsFromDatabase, setClassroomDocumentsFromDatabase] = useState([]);
  //const [allUsersFromDatabase, setAllUsersFromDatabase] = useState([]);
  //const [allDocumentsFromDatabase, setAllDocumentsFromDatabase] = useState([]);

  useEffect(() => {
    api
      .getClassroom(currentClassroomId)
      .then((res) => {
        if (res) {
          setClassroomDataFromDatabase(res.data.rows[0]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getStudents(currentClassroomId)
      .then((res) => {
        if (res) {
          setClassroomStudentsFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getDocuments(currentClassroomId)
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

  /*
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


   */
  return (
    <AppPage location="classrooms" id="classrooms-page">
      <Header
        mainTitle={classroomDataFromDatabase.title}
        subtitle={classroomDataFromDatabase.topic}
        description={classroomDataFromDatabase.description}
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
          {classroomDocumentsFromDatabase.map(() => {
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
