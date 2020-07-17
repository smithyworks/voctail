import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "../common/AppPage";

import iconUser from "../../assets/icon_user.png";
import iconDoc from "../../assets/books.jpg";

import Header from "../common/HeaderSection";
import { ClassroomSection, SectionSection, ChapterSection, DashboardTile } from "../common";
import InviteStudentsDialog from "../common/Dialogs/InviteStudentsDialog";
import UserCard from "../common/UserCard";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { api } from "../../utils";
import { timeParser, urlParser, isConnected } from "../../utils/parsers";
import { toasts } from "../common/AppPage/AppPage";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import VTIconFlexButton from "../common/Buttons/IconButton";

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

function addStudents(classroomId, studentId, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase) {
  const addStudentsToThisClassroom = () => {
    api.addStudentToClassroom(classroomId, studentId).catch((err) => console.log(err));
  };
  addStudentsToThisClassroom();
  api
    .user(studentId)
    .then((res) => {
      if (res) {
        setClassroomStudentsFromDatabase(classroomStudentsFromDatabase.concat([res.data]));
      }
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess("Student added to the classroom!");
}

function ClassroomViewPage() {
  //const classes = useStyles();
  const [currentClassroomId, setCurrentClassroomId] = useState(null);
  const [classroomDataFromDatabase, setClassroomDataFromDatabase] = useState([]);
  const [classroomStudentsFromDatabase, setClassroomStudentsFromDatabase] = useState([]);
  const [classroomOwnerFromDatabase, setClassroomOwnerFromDatabase] = useState([]);
  const [classroomTeachersFromDatabase, setClassroomTeachersFromDatabase] = useState([]);
  const [classroomDocumentsFromDatabase, setClassroomDocumentsFromDatabase] = useState([]);
  const [classroomSectionsFromDatabase, setClassroomSectionsFromDatabase] = useState([]);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //const [allUsersFromDatabase, setAllUsersFromDatabase] = useState([]);
  //const [allDocumentsFromDatabase, setAllDocumentsFromDatabase] = useState([]);

  useEffect(() => {
    setCurrentClassroomId(urlParser());
  }, []);

  useEffect(() => {
    api
      .getClassroom(urlParser())
      .then((res) => {
        if (res) {
          setClassroomDataFromDatabase(res.data.rows[0]);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getStudents(urlParser())
      .then((res) => {
        if (res) {
          setClassroomStudentsFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getOwner(urlParser())
      .then((res) => {
        if (res) {
          setClassroomOwnerFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getTeachers(urlParser())
      .then((res) => {
        if (res) {
          setClassroomTeachersFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getDocuments(urlParser())
      .then((res) => {
        if (res) {
          setClassroomDocumentsFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    api
      .getSections(urlParser())
      .then((res) => {
        if (res) {
          setClassroomSectionsFromDatabase(res.data.rows);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AppPage location="classrooms" id="classrooms-page">
      <Header
        mainTitle={classroomDataFromDatabase.title}
        subtitle={classroomDataFromDatabase.topic}
        description={classroomDataFromDatabase.description}
      />

      <ClassroomSection
        title="Teachers"
        Button={<VTIconFlexButton toolTipLabel={"Add teacher"} onClick={() => setInviteDialogOpen(true)} />}
      >
        <InviteStudentsDialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          onInvite={(ids) => {
            ids.map((id) => {
              addStudents(currentClassroomId, id, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase);
            });
            toasts.toastSuccess("Students added to the database!");
            setInviteDialogOpen(false);
          }}
        />

        <Grid container>
          {classroomOwnerFromDatabase.concat(classroomTeachersFromDatabase).map((member) => {
            return (
              <Grid item style={{ padding: "10px" }}>
                <UserCard
                  name={member.name}
                  email={member.email}
                  avatar={iconUser}
                  tip={timeParser(member.last_seen)}
                  connected={isConnected(member.last_seen)}
                />
              </Grid>
            );
          })}
        </Grid>
      </ClassroomSection>

      <ClassroomSection
        title="Students"
        Button={<VTIconFlexButton toolTipLabel={"Add students"} onClick={() => setInviteDialogOpen(true)} />}
      >
        <InviteStudentsDialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          onInvite={(ids) => {
            ids.map((id) => {
              addStudents(currentClassroomId, id, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase);
            });
            toasts.toastSuccess("Students added to the database!");
            setInviteDialogOpen(false);
          }}
        />

        <Grid container>
          {classroomStudentsFromDatabase.map((member) => {
            return (
              <Grid item style={{ padding: "10px" }}>
                <UserCard
                  name={member.name}
                  email={member.email}
                  avatar={iconUser}
                  tip={timeParser(member.last_seen)}
                  connected={isConnected(member.last_seen)}
                />
              </Grid>
            );
          })}
        </Grid>
      </ClassroomSection>

      <SectionSection title="Sections" Button={<VTIconFlexButton toolTipLabel={"Add section"} />}>
        {classroomSectionsFromDatabase.map((section) => {
          return (
            <ChapterSection
              title={section.title}
              Button={
                <IconButton aria-label="test" onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem>Add Document</MenuItem>
                <MenuItem>Rename</MenuItem>
                <MenuItem>Delete</MenuItem>
              </Menu>
              <Grid container>
                {classroomDocumentsFromDatabase.map((document) => {
                  if (document.section === section.title) {
                    return (
                      <DashboardTile
                        thumbnail={iconDoc}
                        title={document.title}
                        author={document.author}
                        onOpen={() => window.open("/documents/" + document.document_id, "_self")}
                      />
                    );
                  }
                })}
              </Grid>
            </ChapterSection>
          );
        })}
      </SectionSection>
    </AppPage>
  );
}

export default ClassroomViewPage;
