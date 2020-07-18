import React from "react";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";
import colors from "../../assets/colors.json";
const useStyles = makeStyles(() => ({
  headUpText: {
    margin: "auto",
    textAlign: "center",
    fontStyle: "italic",
  },

  headUp1: {
    //Font to do
    textAlign: "center",
    ...colors.classroomHeader.headUp,
  },

  headUp2: {
    //Font to do
    textAlign: "center",
  },

  headUp3: {
    //Font to do
    fontStyle: "italic",
    textAlign: "center",
  },

  container: {
    ...colors.classroomHeader.container,
    paddingTop: "1%",
    paddingBottom: "1%",
    marginBottom: "5%",
  },
}));

function HeaderSection(props) {
  const classes = useStyles();
  return (
    <Container className={classes.container} maxWidth="xl">
      <Typography className={classes.headUp1} variant="h5">
        {props.mainTitle}
      </Typography>
      <Typography align="center" className={classes.headUp2} variant="h6">
        {props.subtitle}
      </Typography>
      <Typography className={classes.headUp3} align="center">
        {props.description}
      </Typography>
    </Container>
  );
}

export default HeaderSection;
