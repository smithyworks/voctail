import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppPage from "../common/AppPage";
import { useParams } from "react-router-dom";

import iconDoc from "../../assets/books.jpg";

import Header from "../common/HeaderSection";
import { ClassroomSection, SectionSection, ChapterSection, DashboardTile, UserTile } from "../common";
import InviteStudentsDialog from "../common/Dialogs/InviteStudentsDialog";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { api } from "../../utils";
import { timeParser, isConnected } from "../../utils/parsers";
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
  const { classroom_id } = useParams();

  //const classes = useStyles();
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
    // There is no reason for you be making so many calls to the server
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
        .getOwner(classroom_id)
        .then((res) => {
          if (res) {
            setClassroomOwnerFromDatabase(res.data.rows);
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
        .getDocuments(classroom_id)
        .then((res) => {
          if (res) {
            setClassroomDocumentsFromDatabase(res.data.rows);
          }
        })
        .catch((err) => console.log(err));
      api
        .getSections(classroom_id)
        .then((res) => {
          if (res) {
            setClassroomSectionsFromDatabase(res.data.rows);
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
        Button={<VTIconFlexButton toolTipLabel={"Add teacher"} onClick={() => setInviteDialogOpen(true)} />}
      >
        <InviteStudentsDialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          onInvite={(ids) => {
            ids.map((id) => {
              addStudents(classroom_id, id, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase);
            });
            toasts.toastSuccess("Students added to the database!");
            setInviteDialogOpen(false);
          }}
        />

        {classroomOwnerFromDatabase.concat(classroomTeachersFromDatabase).map((member, i) => {
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
        Button={<VTIconFlexButton toolTipLabel={"Add students"} onClick={() => setInviteDialogOpen(true)} />}
      >
        <InviteStudentsDialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          onInvite={(ids) => {
            ids.map((id) => {
              addStudents(classroom_id, id, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase);
            });
            toasts.toastSuccess("Students added to the database!");
            setInviteDialogOpen(false);
          }}
        />

        {classroomStudentsFromDatabase.map((member, i) => {
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
                {classroomDocumentsFromDatabase.map((document, i) => {
                  if (document.section === section.title) {
                    return (
                      <DashboardTile
                        key={i}
                        thumbnail={iconDoc}
                        title={document.title}
                        author={document.author}
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
