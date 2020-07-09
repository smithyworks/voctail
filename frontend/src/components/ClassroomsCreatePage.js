//This page will be used to test components

import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "./common/AppPage";
import { api } from "../utils";
import userIcon from "../assets/icon_user.png";
import documentIcon from "../assets/icon_document.png";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import { toasts } from "./common/AppPage/AppPage";
import VTButton from "./common/Buttons/VTButton";

const useStyles = makeStyles(() => ({
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

function HeadUpText(props) {
  const classes = useStyles();
  return <Typography className={classes.headUpText}>{props.text}</Typography>;
}

function addStudents() {
  const addStudentsToThisClassroom = () => {
    api.addStudentToClassroom(10000, Math.floor(Math.random() * 30)).catch((err) => console.log(err));
  };
  addStudentsToThisClassroom();
  toasts.toastSuccess("Student added to the database!");
}

function addDocuments() {
  const addDocumentsToThisClassroom = () => {
    api.addDocumentToClassroom(10000, Math.floor(Math.random() * 20)).catch((err) => console.log(err));
  };
  addDocumentsToThisClassroom();
  toasts.toastSuccess("Document added to the database!");
}

function ClassroomsCreatePage() {
  const classes = useStyles();
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
  const [checked, setChecked] = useState([1]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <AppPage location="classrooms" id="classrooms-page">
      <HeadUpText text="This page is used for testing." />

      <List dense className={classes.root}>
        {classroomStudentsFromDatabase.map((tile) => {
          return (
            <ListItem key={tile.user_id} button>
              <ListItemAvatar>
                <Avatar alt={`Avatar n°${tile.user_id + 1}`} src={userIcon} />
              </ListItemAvatar>
              <ListItemText primary={`${tile.name}`} />
            </ListItem>
          );
        })}
      </List>
      <VTButton accept className={classes.button} onClick={addStudents} color="primary">
        Add student
      </VTButton>

      <List dense className={classes.root}>
        {classroomDocumentsFromDatabase.map((tile) => {
          return (
            <ListItem key={tile.document_id} button>
              <ListItemAvatar>
                <Avatar alt={`Avatar n°${tile.user_id + 1}`} src={documentIcon} />
              </ListItemAvatar>
              <ListItemText primary={`${tile.title}, ${tile.author}`} />
            </ListItem>
          );
        })}
      </List>
      <VTButton accept className={classes.button} onClick={addDocuments} color="primary">
        Add document
      </VTButton>

      <HeadUpText text="Classrooms from the database" />
      <List dense className={classes.root}>
        {allUsersFromDatabase.map((tile) => {
          const labelId = `checkbox-list-secondary-label-${tile.name}`;
          return (
            <ListItem key={tile.user_id} button>
              <ListItemAvatar>
                <Avatar alt={`Avatar n°${tile.id + 1}`} src={userIcon} />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={tile.name} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={handleToggle(tile.user_id)}
                  checked={registeredStudentIds.indexOf(tile.user_id) !== -1}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>

      <HeadUpText text="Documents from the database" />

      <List dense className={classes.root}>
        {allDocumentsFromDatabase.map((tile) => {
          const labelId = `checkbox-list-secondary-label-${tile.title}`;
          return (
            <ListItem key={tile.document_id} button>
              <ListItemAvatar>
                <Avatar alt={`Avatar n°${tile.id + 1}`} src={documentIcon} />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={tile.title} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={handleToggle(tile.document_id)}
                  checked={registeredDocumentIds.indexOf(tile.document_id) !== -1}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </AppPage>
  );
}

export default ClassroomsCreatePage;
