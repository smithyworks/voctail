import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import color from "../../assets/colors.json";
import clsx from "clsx";

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
//"&:hover"

//continue here add other parts
function ChoiceButton({ accept, reject, show, id, onClick, children }) {
  const classes = useStyles();

  let cName = classes.neutral;
  if (accept) cName = classes.accept;
  else if (reject) cName = classes.reject;
  else if (show) cName = classes.show;

  cName = clsx(classes.button, cName);

  return (
    <Button key={id} variant={"outlined"} onClick={onClick} startIcon={<LocalBarIcon />} className={cName}>
      {children}
    </Button>
  );
}

export default ChoiceButton;
