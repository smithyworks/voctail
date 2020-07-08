import React from "react";
import { Tooltip } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";

import colors from "../../../assets/colors.json";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
  button: { ...colors.button.danger },
});

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    ...colors.button.danger,
    boxShadow: theme.shadows[1],
    fontSize: 15,
  },
}))(Tooltip);

function VTDeleteButton({ ...props }) {
  const classes = useStyles();

  return (
    <LightTooltip title="Delete" placement="top">
      <IconButton className={classes.button} variant="contained" {...props}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </LightTooltip>
  );
}

export default VTDeleteButton;
