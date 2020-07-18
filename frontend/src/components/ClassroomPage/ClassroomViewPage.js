import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import AppPage from "../common/AppPage";
import { useParams } from "react-router-dom";
import iconDoc from "../../assets/books.jpg";
import Header from "../common/HeaderSection";
import { ClassroomSection, SectionSection, ChapterSection, DashboardTile, UserTile } from "../common";
import InviteMembersDialog from "../common/InviteMembersDialog";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { api } from "../../utils";
import { timeParser, isConnected } from "../../utils/parsers";
import { toasts } from "../common/AppPage/AppPage";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import VTIconFlexButton from "../common/Buttons/IconButton";

function indexOfStudent(studentId, students) {
  let output = 0;
  students.forEach((student, index) => {
    if (student.user_id === studentId) {
      output = index;
    }
  });
  return output;
}

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

function deleteStudent(classroomId, studentId, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase) {
  const indexOfDeletedStudent = indexOfStudent(studentId, classroomStudentsFromDatabase);
  api
    .deleteStudentFromClassroom(classroomId, studentId)
    .then((res) => {
      setClassroomStudentsFromDatabase(
        classroomStudentsFromDatabase
          .slice(0, indexOfDeletedStudent)
          .concat(classroomStudentsFromDatabase.slice(indexOfDeletedStudent + 1))
      );
    })
    .catch((err) => console.log(err));
  toasts.toastSuccess("Student deleted!");
}

function addDocuments(
  classroomId,
  documentId,
  section,
  classroomDocumentsFromDatabase,
  setClassroomDocumentsFromDatabase
) {
  const addDocumentsToThisClassroom = () => {
    api
      .addDocumentToClassroom(classroomId, documentId, section)
      .then((res) => {
        if (res) {
          setClassroomDocumentsFromDatabase(classroomDocumentsFromDatabase.concat([res.data.rows[0]]));
          toasts.toastSuccess("Document added to the classroom.");
        }
      })
      .catch((err) => console.log(err));
  };
  addDocumentsToThisClassroom();
}

function getSections(classroomDocumentsFromDatabase) {
  let sections = [];
  classroomDocumentsFromDatabase.forEach((document) => {
    if (sections.indexOf(document.section) === -1) {
      sections.push(document.section);
    }
  });
  return sections;
}

function ClassroomViewPage() {
  const { classroom_id } = useParams();
  const [classroomDataFromDatabase, setClassroomDataFromDatabase] = useState([]);
  const [classroomIsTeacher, setClassroomIsTeacher] = useState(false);
  const [classroomStudentsFromDatabase, setClassroomStudentsFromDatabase] = useState([]);
  const [classroomTeachersFromDatabase, setClassroomTeachersFromDatabase] = useState([]);
  const [classroomDocumentsFromDatabase, setClassroomDocumentsFromDatabase] = useState([]);
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
        api
          .isTeacher(classroom_id, res.data.user_id)
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
    if (classroom_id) {
      api
        .getClassroom(classroom_id)
        .then((res) => {
          if (res) {
            setClassroomDataFromDatabase(res.data.rows[0]);
          }
        })
        .catch((err) => console.log(err));
      api
        .getStudents(classroom_id)
        .then((res) => {
          if (res) {
            setClassroomStudentsFromDatabase(res.data.rows);
          }
        })
        .catch((err) => console.log(err));
      api
        .getTeachers(classroom_id)
        .then((res) => {
          if (res) {
            setClassroomTeachersFromDatabase(res.data.rows);
          }
        })
        .catch((err) => console.log(err));
      api
        .getDocuments(classroom_id, 0)
        .then((res) => {
          if (res) {
            setClassroomDocumentsFromDatabase(res.data.rows);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [classroom_id]);

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
          classroomIsTeacher ? (
            <VTIconFlexButton toolTipLabel={"Add teacher"} onClick={() => setInviteTeachersDialogOpen(true)} />
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
              addTeachers(classroom_id, id, classroomTeachersFromDatabase, setClassroomTeachersFromDatabase);
            });
            setInviteTeachersDialogOpen(false);
          }}
        />

        {classroomTeachersFromDatabase.map((member, i) => {
          return (
            <UserTile
              key={i}
              user={member}
              tooltipTitle={timeParser(member.last_seen)}
              connected={isConnected(member.last_seen)}
            />
          );
        })}
      </ClassroomSection>

      <ClassroomSection
        title="Students"
        Button={
          classroomIsTeacher ? (
            <VTIconFlexButton toolTipLabel={"Add students"} onClick={() => setInviteStudentsDialogOpen(true)} />
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
              addStudents(classroom_id, id, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase);
            });
            setInviteStudentsDialogOpen(false);
          }}
        />

        {classroomStudentsFromDatabase.map((member, i) => {
          return (
            <UserTile
              key={i}
              user={member}
              tooltipTitle={timeParser(member.last_seen)}
              connected={isConnected(member.last_seen)}
              onDelete={() => {
                deleteStudent(
                  classroom_id,
                  member.user_id,
                  classroomStudentsFromDatabase,
                  setClassroomStudentsFromDatabase
                );
              }}
            />
          );
        })}
      </ClassroomSection>

      <SectionSection
        title="Sections"
        Button={
          classroomIsTeacher ? (
            <VTIconFlexButton
              toolTipLabel={"Add section"}
              onClick={() => console.log(classroomDocumentsFromDatabase)}
            />
          ) : (
            <span />
          )
        }
      >
        {getSections(classroomDocumentsFromDatabase).map((section, s) => {
          return (
            <ChapterSection
              key={s}
              title={section}
              Button={
                <IconButton aria-label="test" onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem
                  onClick={() =>
                    addDocuments(
                      classroom_id,
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
                {classroomDocumentsFromDatabase.map((document, i) => {
                  if (document.section === section) {
                    return (
                      <DashboardTile
                        key={i}
                        title={document.title}
                        author={document.author}
                        category={document.category}
                        linkTo={`/classrooms/${classroom_id}/documents/${document.document_id}`}
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
