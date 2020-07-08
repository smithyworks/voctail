import React from "react";
import { Tooltip } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";

import colors from "../../assets/colors.json";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
  button: { ...colors.button.secondary },
});

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    ...colors.button.secondary,
    boxShadow: theme.shadows[1],
    fontSize: 15,
  },
}))(Tooltip);

function VTIconButton({ ...props }) {
  const classes = useStyles();

  return (
    <LightTooltip title="Add new document" placement="top">
      <IconButton className={classes.button} variant="contained" {...props}>
        <AddBoxIcon fontSize="large" />
      </IconButton>
    </LightTooltip>
  );
}

export default VTIconButton;
