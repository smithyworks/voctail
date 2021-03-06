import React, { useContext, useState, useEffect } from "react";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useParams } from "react-router-dom";

import { AppPage, toasts } from "../common";
import ProfilePicture from "./ProfilePicture";
import ProfileSection from "./ProfileSection";
import EditableItem from "./EditableItem";
import VocabularyCloud from "./VocabularyCloud";
import { UserContext, refresh } from "../../App";
import { api } from "../../utils";
import DocumentMetrics from "./DocumentMetrics";
import QuizMetrics from "./QuizMetrics";
import VoctailCheckbox from "../common/VoctailCheckbox";
import ErrorDialogField from "../common/Dialogs/ErrorDialogField";

const useStyles = makeStyles({
  container: {
    padding: "20px 0",
  },
  pic: { padding: "0 20px" },
  info: { padding: "0 20px", display: "flex", alignItems: "center" },
  infoInnerContainer: { width: "100%" },
  infoItem: { display: "inline-block", width: "49%", margin: "10px 0" },
  infoItemTitle: {
    fontWeight: 300,
  },
  infoItemValue: {
    fontSize: "1.5em",
  },
  subSectionTitle: {
    fontWeight: 300,
  },
});

function ProfilePage() {
  const classes = useStyles();
  const contextUser = useContext(UserContext);

  const { user_id } = useParams();
  const isSelf = !user_id || user_id === contextUser.user_id?.toString();

  const [externalUser, setExternalUser] = useState({});
  useEffect(() => {
    if (!isSelf)
      api
        .user(user_id)
        .then((res) => setExternalUser(res.data))
        .catch((err) => toasts.toastError("Encountered an error while communicating with the server."));
  }, [isSelf, user_id]);

  const user = isSelf ? contextUser : externalUser;

  const [vocabularyFilter, setVocabFilter] = useState();
  const [showKnowns, setShowKnowns] = useState(true);

  function editName(v) {
    api
      .setName(v)
      .then((res) => {
        toasts.toastSuccess("Successfully updated your name!");
        refresh();
      })
      .catch((err) => {
        toasts.toastError("Encountered an error communicating with the server!");
      });
  }
  function editEmail(v) {
    api
      .setEmail(v)
      .then((res) => {
        toasts.toastSuccess("Successfully updated your email!");
        refresh();
      })
      .catch((err) => {
        toasts.toastError("Encountered an error communicating with the server!");
      });
  }
  function editPassword(v) {
    api
      .setName(v)
      .then((res) => {
        toasts.toastSuccess("Successfully updated your password!");
        refresh();
      })
      .catch((err) => {
        toasts.toastError("Encountered an error communicating with the server!");
      });
  }

  return (
    <AppPage>
      <div className={classes.container}>
        <ProfileSection title="Personal Information" disablePadding>
          <Grid container>
            <Grid item className={classes.pic}>
              <ProfilePicture user={user} dimension={isSelf ? "250px" : "150px"} editable={!!isSelf} />
            </Grid>
            <Grid item xs className={classes.info}>
              <div className={classes.infoInnerContainer}>
                <EditableItem title="Name" value={user.name ?? "..."} onEdit={editName} disabled={!isSelf} />
                <EditableItem title="Email" value={user.email ?? "..."} isEmail onEdit={editEmail} disabled={!isSelf} />
                <EditableItem title="Password" value="**********" onEdit={editPassword} disabled={!isSelf} />
              </div>
            </Grid>
          </Grid>
        </ProfileSection>

        <ProfileSection
          title="Vocabulary"
          Filter={
            <Grid container justify="space-between">
              <Grid item style={{ display: "flex", alignItems: "baseline" }}>
                <span>
                  <VoctailCheckbox
                    style={{ marginBottom: 7 }}
                    checked={showKnowns}
                    onClick={() => setShowKnowns(!showKnowns)}
                  />
                </span>
                <Typography display="inline" style={{ margin: "0 60px 0 0" }}>
                  Show known words
                </Typography>
                <ErrorDialogField
                  margin="dense"
                  variant="outlined"
                  placeholder="Filter..."
                  onChange={(e) => setVocabFilter(e.target.value)}
                />
              </Grid>
            </Grid>
          }
        >
          <VocabularyCloud
            userId={user.user_id}
            filter={vocabularyFilter}
            showKnowns={showKnowns}
            showActions={isSelf}
          />
        </ProfileSection>

        <ProfileSection title="Quizzes">
          <QuizMetrics userId={user.user_id} />
        </ProfileSection>

        <ProfileSection title="Documents">
          <Grid container justify="space-between">
            <DocumentMetrics userId={user.user_id} />
          </Grid>
        </ProfileSection>
      </div>
    </AppPage>
  );
}

export default ProfilePage;
