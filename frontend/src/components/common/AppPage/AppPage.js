import React, { useContext } from "react";
import { Grid, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { localStorage } from "../../../utils";
import { UserContext } from "../../../App.js";
import TopNav from "./TopNav.js";

const useStyles = makeStyles({
  pageContainer: {
    height: "100%",
  },
  bodyContainer: { overflowX: "hidden", overflowY: "auto" },
  body: {
    height: "100%",
  },
});

// The AppPage is meant to be rendered directly into the id="root" element.

function AppPage({ children, id, location, title }) {
  const classes = useStyles();
  const user = useContext(UserContext);

  if (title) window.document.title = title;
  else if (location === "dashboard") window.document.title = "VocTail | Dashboard";
  else if (location === "documents") window.document.title = "VocTail | Documents";
  else if (location === "quizzes") window.document.title = "VocTail | Quizzes";
  else if (location === "classrooms") window.document.title = "VocTail | Classrooms";
  else if (location === "admin") window.document.title = "VocTail | Admin";
  else window.document.title = "VocTail";

  return (
    <Grid container direction="column" className={classes.pageContainer}>
      <TopNav
        location={location}
        loggedIn={localStorage.hasTokens()}
        isAdmin={!!user?.admin}
        masquerading={!!user?.masquerading}
      />
      <Grid item xs className={classes.bodyContainer}>
        <Container id={id} className={classes.body}>
          {children}
        </Container>
      </Grid>
    </Grid>
  );
}

export default AppPage;
