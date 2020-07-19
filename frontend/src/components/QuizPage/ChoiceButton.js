import React, { useState } from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import color from "../../assets/colors.json";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  container: { height: "100%", width: "100%" },
  gridHeader: { height: "20%", width: "100%", backgroundColor: "rgba(0,0,0,0.3)" },
  gridQuizItem: { height: "80%", width: "100%" },
  gridWord: { height: "30%", width: "100%" },
  gridTranslations: { height: "40%", width: "100%" },
  gridActions: { height: "30%", width: "30%" },
  grid: { height: "100%", width: "100%" },
  userItem: { width: "150px" },
  neutral: color.quizChoiceButton.neutral,
  accept: color.quizChoiceButton.accept,
  reject: color.quizChoiceButton.reject,
  show: color.quizChoiceButton.show,
  inactive: color.quizChoiceButton.inactive,
  paper: {
    width: "15%",
    height: "54px",
    cursor: "pointer",
    display: "inline-block",
    textDecoration: "none",
  },
  wordContainer: {
    width: "80%",
    height: "50px",
    position: "relative",
    overflow: "hidden",
  },
  word: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
  iconContainer: {
    width: "20%",
    height: "50px",
    position: "relative",
    overflow: "hidden",
  },

  icon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
  button: {
    textDecoration: "none",
    padding: "4px 20px 0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    textTransform: "none",
    borderWidth: "3px",
  },
});

const useIconColors = makeStyles(color.quizChoiceIcon);

//continue here add other parts
function ChoiceButton({ inactive, accept, reject, show, id, onClick, children }) {
  const classes = useStyles();
  const iconColors = useIconColors();

  const [hovered, setHovered] = useState(false);

  let cName = classes.neutral;
  let iconColor = { icon: iconColors.neutral, iconHover: iconColors.neutralHover };
  if (inactive) cName = classes.inactive;
  else if (accept) {
    cName = classes.accept;
    iconColor = { icon: iconColors.accept, iconHover: iconColors.acceptHover };
  } else if (reject) {
    cName = classes.reject;
    iconColor = { icon: iconColors.reject, iconHover: iconColors.rejectHover };
  } else if (show) {
    cName = classes.show;
    iconColor = { icon: iconColors.show, iconHover: iconColors.showHover };
  }

  cName = clsx(classes.paper, cName);

  const classIcon =
    hovered && !inactive
      ? clsx(classes.iconContainer, iconColor.iconHover)
      : clsx(classes.iconContainer, iconColor.icon);

  return (
    <Paper
      key={id}
      onClick={onClick}
      className={cName}
      component={"Button"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Grid container justify={"space-between"} direction={"row"}>
        <Paper className={classIcon}>
          <LocalBarIcon className={classes.icon} />
        </Paper>
        <div className={classes.wordContainer}>
          <div className={classes.word}>{children}</div>
        </div>
      </Grid>
    </Paper>
  );
}

export default ChoiceButton;
