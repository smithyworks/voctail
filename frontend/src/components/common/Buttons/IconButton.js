import React from "react";
import { Tooltip } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";

import colors from "../../../assets/colors.json";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
  button: { ...colors.button.secondary },
  disabledButton: { ...colors.button.disabled },
});

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    ...colors.button.secondary,
    boxShadow: theme.shadows[1],
    fontSize: 15,
  },
}))(Tooltip);

export function VTIconFlexButton({ toolTipLabel, voctailDisabled, ...props }) {
  const classes = useStyles();

  return (
    <LightTooltip title={toolTipLabel} placement="top">
      {voctailDisabled ? (
        <IconButton className={classes.disabledButton} variant="contained" {...props}>
          <AddBoxIcon fontSize="large" />
        </IconButton>
      ) : (
        <IconButton className={classes.button} variant="contained" {...props}>
          <AddBoxIcon fontSize="large" />
        </IconButton>
      )}
    </LightTooltip>
  );
}

export default VTIconFlexButton;
