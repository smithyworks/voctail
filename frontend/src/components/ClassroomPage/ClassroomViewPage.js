import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import AppPage from "../common/AppPage";
import { useParams } from "react-router-dom";
import Header from "../common/HeaderSection";
import { ClassroomSection, SectionSection, ChapterSection, DashboardTile, UserTile } from "../common";
import InviteMembersDialog from "../common/InviteMembersDialog";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { api } from "../../utils";
import { timeParser, isConnected } from "../../utils/parsers";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import VTIconFlexButton from "../common/Buttons/IconButton";
import { addMembers, deleteMember, addDocuments, getSections } from "./ClassroomViewUtils";

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
            addMembers(classroom_id, ids, true, classroomTeachersFromDatabase, setClassroomTeachersFromDatabase);
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
              isMemberTeacher={true}
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
            addMembers(classroom_id, ids, false, classroomStudentsFromDatabase, setClassroomStudentsFromDatabase);
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
                deleteMember(
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

      <SectionSection title="Sections">
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
                  onClick={() => {
                    console.log("hello");
                    setAnchorEl(false);
                  }}
                >
                  Rename
                </MenuItem>
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
