import React from "react";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  headUpText: {
    margin: "auto",
    textAlign: "center",
    fontStyle: "italic",
  },

  headUp1: {
    //Font to do
    textAlign: "center",
    color: "#0B6374",
  },

  headUp2: {
    //Font to do
    textAlign: "center",
  },

  headUp3: {
    //Font to do
    fontStyle: "italic",
    textAlign: "center",
    marginTop: "1%",
  },

  container: {
    backgroundColor: "#D4E4E4",
    paddingTop: "3%",
    paddingBottom: "3%",
    marginBottom: "5%",
  },
}));

function HeaderSection(props) {
  const classes = useStyles();
  return (
    <Container className={classes.container} maxWidth="xl">
      <Typography className={classes.headUp1} variant="h2">
        {props.mainTitle}
      </Typography>
      <Typography align="center" classeName={classes.headUp2} variant="h4">
        {props.subtitle}
      </Typography>
      <Typography className={classes.headUp3} align="center" variant="h5">
        {props.description}
      </Typography>
    </Container>
  );
}

export default HeaderSection;
