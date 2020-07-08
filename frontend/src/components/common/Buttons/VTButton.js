import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import colors from "../../../assets/colors.json";

const useStyles = makeStyles({
  neutral: { ...colors.button.neutral, "&:hover": { ...colors.button.neutralHover } },
  accept: { ...colors.button.accept, "&:hover": { ...colors.button.acceptHover } },
  danger: { ...colors.button.danger, "&:hover": { ...colors.button.dangerHover } },
  secondary: { ...colors.button.secondary, "&:hover": { ...colors.button.secondaryHover } },
});

function VTButton({ neutral, accept, danger, secondary, className, variant: variantOverride, ...props }) {
  const classes = useStyles();

  let cName = classes.neutral,
    variant = "contained";
  if (accept) cName = classes.accept;
  else if (danger) cName = classes.danger;
  else if (secondary) {
    cName = classes.secondary;
    variant = "outlined";
  }

  if (className) cName += " " + className;
  if (variantOverride) variant = variantOverride;

  return <Button className={cName} variant={variant} {...props} />;
}

export default VTButton;
