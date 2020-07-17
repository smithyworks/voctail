import React, { useState, useEffect } from "react";
import { Grid, Divider } from "@material-ui/core";
import AppPage from "../common/AppPage";

import iconUser from "../../assets/icon_user.png";
import iconDoc from "../../assets/books.jpg";

import Header from "../common/HeaderSection";
import { ClassroomSection, SectionSection, ChapterSection, DashboardTile } from "../common";
import InviteMembersDialog from "../common/InviteMembersDialog";
import UserCard from "../common/UserCard";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { api } from "../../utils";
import { timeParser, urlParser, isConnected, isTeacher } from "../../utils/parsers";
import { toasts } from "../common/AppPage/AppPage";
import MoreVertIcon from "@material-ui/icons/MoreVert";

function addTeachers(classroomId, teacherId, classroomTeachersFromDatabase, setClassroomTeachersFromDatabase) {
  const addTeachersToThisClassroom = () => {
    api.addTeacherToClassroom(classroomId, teacherId).catch((err) => console.log(err));
  };
  addTeachersToThisClassroom();
  api
    .user(teacherId)
    .then((res) => {
      if (res) {
        setClassroomTeachersFromDatabase(classroomTeachersFromDatabase.concat([res.data]));
        toasts.toastSuccess("Teacher added to the classroom.");
      }
    })
    .catch((err) => console.log(err));
}

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
        toasts.toastSuccess("Student added to the classroom.");
      }
    })
    .catch((err) => console.log(err));
}

function addDocuments(
  classroomId,
  documentId,
  section,
  classroomDocumentsFromDatabase,
  setClassroomDocumentsFromDatabase,
  setClassroomsSectionsUpdate,
  classroomsSectionsUpdate
) {
  const addDocumentsToThisClassroom = () => {
    api.addDocumentToClassroom(classroomId, documentId, section).catch((err) => console.log(err));
  };
  addDocumentsToThisClassroom();
  api
    .document(documentId)
    .then((res) => {
      if (res) {
        setClassroomDocumentsFromDatabase(classroomDocumentsFromDatabase.concat([res.data]));
        toasts.toastSuccess("Document added to the classroom.");
      }
    })
    .catch((err) => console.log(err));
}

function isOwner(user, classroomOwnerFromDatabase) {
  if (classroomOwnerFromDatabase.length > 0) {
    return user.user_id === classroomOwnerFromDatabase[0].user_id;
  }
  return false;
}

function ClassroomViewPage() {
  const [user, setUser] = useState([]);
  const [currentClassroomId, setCurrentClassroomId] = useState(null);
  const [classroomDataFromDatabase, setClassroomDataFromDatabase] = useState([]);
  const [classroomIsTeacher, setClassroomIsTeacher] = useState(false);
  const [classroomStudentsFromDatabase, setClassroomStudentsFromDatabase] = useState([]);
  const [classroomOwnerFromDatabase, setClassroomOwnerFromDatabase] = useState([]);
  const [classroomTeachersFromDatabase, setClassroomTeachersFromDatabase] = useState([]);
  const [classroomDocumentsFromDatabase, setClassroomDocumentsFromDatabase] = useState([]);
  const [classroomSectionsFromDatabase, setClassroomSectionsFromDatabase] = useState([]);
  const [inviteTeachersDialogOpen, setInviteTeachersDialogOpen] = useState(false);
  const [inviteStudentsDialogOpen, setInviteStudentsDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    api
      .user()
      .then((res) => {
        if (res) setUser(res.data);
        api
          .isTeacher(urlParser(), res.data.user_id)
          .then((res2) => {
            if (res2) {
              setClassroomIsTeacher(res2.data.rows[0].teacher);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

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
          console.log(res.data.rows);
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
        Button={
          classroomIsTeacher || isOwner(user, classroomOwnerFromDatabase) || user.admin === true ? (
            <IconButton aria-label="test" onClick={() => setInviteTeachersDialogOpen(true)}>
              <AddBoxIcon fontSize="large" style={{ color: "darkblue" }} />
            </IconButton>
          ) : (
            <span />
          )
        }
      >
        <InviteMembersDialog
          memberType="Teachers"
          open={inviteTeachersDialogOpen}
          onClose={() => setInviteTeachersDialogOpen(false)}
          onInvite={(ids) => {
            ids.map((id) => {
              addTeachers(currentClassroomId, id, classroomTeachersFromDatabase, setClassroomTeachersFromDatabase);
            });
            setInviteTeachersDialogOpen(false);
          }}
        />

        <Grid container>
          {classroomOwnerFromDatabase.concat(classroomTeachersFromDatabase).map((member) => {
            return (
              <Grid item style={{ padding: "10px" }}>
                <UserCard
                  teacher
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
        Button={
          classroomIsTeacher || isOwner(user, classroomOwnerFromDatabase) || user.admin === true ? (
            <IconButton aria-label="test" onClick={() => setInviteStudentsDialogOpen(true)}>
              <AddBoxIcon fontSize="large" style={{ color: "darkblue" }} />
            </IconButton>
          ) : (
            <span />
          )
        }
      >
        <InviteMembersDialog
          memberType="Students"
          open={inviteStudentsDialogOpen}
          onClose={() => setInviteStudentsDialogOpen(false)}
          onInvite={(ids) => {
            ids.map((id) => {
              addStudents(currentClassroomId, id, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase);
            });
            setInviteStudentsDialogOpen(false);
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

      <SectionSection
        title="Sections"
        Button={
          classroomIsTeacher || isOwner(user, classroomOwnerFromDatabase) || user.admin === true ? (
            <IconButton aria-label="test">
              <AddBoxIcon fontSize="large" style={{ color: "darkblue" }} />
            </IconButton>
          ) : (
            <span />
          )
        }
      >
        {classroomSectionsFromDatabase.map((section) => {
          return (
            <ChapterSection
              title={section.title}
              Button={
                classroomIsTeacher || isOwner(user, classroomOwnerFromDatabase) || user.admin === true ? (
                  <IconButton aria-label="test" onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                ) : (
                  <span />
                )
              }
            >
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem
                  onClick={() =>
                    addDocuments(
                      currentClassroomId,
                      12,
                      "Chapter 1",
                      classroomDocumentsFromDatabase,
                      setClassroomDocumentsFromDatabase
                    )
                  }
                >
                  Add Hans & Gretel
                </MenuItem>
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
