import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import colors from "../../assets/colors.json";
import clsx from "clsx";

const extract = (colQChoice) => {
  const cols = {
    color: colQChoice.color,
    backgroundColor: colQChoice.backgroundColor,
    borderColor: colQChoice.borderColor,
  };

  return { ...cols, "&:hover": { ...colors.quizActionButton.general, ...cols } };
};
const useStyles = makeStyles({
  next: { ...extract(colors.quizChoiceButton.accept) },
  done: { ...extract(colors.quizChoiceButton.reject) },
  show: { ...extract(colors.quizChoiceButton.show) },
});

function ActionButton({ show, done, className, variant: variantOverride, ...props }) {
  const classes = useStyles();

  let cName = classes.next;
  if (show) cName = classes.show;
  else if (done) cName = classes.done;

  if (className) cName = clsx(cName, className);

  return <Button className={cName} variant={"outlined"} {...props} />;
}

export default ActionButton;
