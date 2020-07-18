import React from "react";
import { Typography as T, Paper, Popper, Grid, ClickAwayListener } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import CrossIcon from "@material-ui/icons/Clear";
import timediff from "timediff";

import { VTButton } from "../common";

function timeElapsed(last) {
  let d = "";
  if (!isNaN(Date.parse(last))) {
    const { months, days, hours, minutes } = timediff(Date.parse(last), new Date(), "MDHm");
    if (months > 0 || days > 0 || hours > 0 || minutes > 0) {
      if (months > 0) {
        d += `${hours} month`;
      } else if (days > 0) {
        d += `${hours} day`;
      } else if (hours > 0) {
        d += `${hours} hour`;
      } else if (minutes > 0) {
        d += `${minutes} minutes`;
      }
    } else d = "just now";
  } else d = "never";

  return d + " ago";
}

const useStyles = makeStyles({
  paper: {
    margin: "2px",
    textAlign: "left",
    border: "1px solid lightgrey",
    overflow: "hidden",
    minHeight: "150px",
    minWidth: "250px",
  },
  header: { fontWeight: "bold", fontSize: "20px", padding: "5px 10px 0 10px" },
  body: { maxHeight: "200px" },

  actions: {
    padding: "8px",
    textAlign: "right",
  },

  knownButton: { fontWeight: "bold" },

  info: {
    padding: "0 10px",
  },
  infoTitle: {
    padding: "0 10px",
  },
  infoValue: {
    color: "#444",
    padding: "0 10px",
  },
});

function TranslationPopup({ open, anchor, onMarkKnown, onMarkUnknown, onClose, entry, showActions }) {
  const classes = useStyles();

  function _markKnown() {
    if (typeof onMarkKnown === "function") onMarkKnown(entry?.word_id);
  }
  function _markUnknown() {
    if (typeof onMarkUnknown === "function") onMarkUnknown(entry?.word_id);
  }

  return (
    <Popper open={!!open && !!anchor} anchorEl={anchor} placement="bottom" disablePortal>
      <ClickAwayListener onClickAway={onClose}>
        <Paper className={classes.paper} component={Grid} container direction="column" wrap="nowrap">
          <T variant="subtitle1" className={classes.header}>
            {entry?.word}
          </T>

          <Grid container className={classes.info}>
            <Grid item xs className={classes.infoTitle}>
              <T align="right">known</T>
            </Grid>
            <Grid item xs className={classes.infoValue}>
              <T>
                {entry?.known ? (
                  <CheckIcon fontSize="small" style={{ marginBottom: -4 }} />
                ) : (
                  <CrossIcon fontSize="small" style={{ marginBottom: -4 }} />
                )}
              </T>
            </Grid>
          </Grid>
          <Grid container className={classes.info}>
            <Grid item xs className={classes.infoTitle}>
              <T align="right">certainty</T>
            </Grid>
            <Grid item xs className={classes.infoValue}>
              <T>{entry?.certainty}</T>
            </Grid>
          </Grid>
          <Grid container className={classes.info}>
            <Grid item xs className={classes.infoTitle}>
              <T align="right">encounters</T>
            </Grid>
            <Grid item xs className={classes.infoValue}>
              <T>{entry?.encounters}</T>
            </Grid>
          </Grid>
          <Grid container className={classes.info}>
            <Grid item xs className={classes.infoTitle}>
              <T align="right">last seen</T>
            </Grid>
            <Grid item xs className={classes.infoValue}>
              <T>{timeElapsed(entry?.last_seen)}</T>
            </Grid>
          </Grid>

          {!!showActions && (
            <div className={classes.actions}>
              <VTButton
                variant="contained"
                size="small"
                startIcon={entry?.known ? <CrossIcon /> : <CheckIcon />}
                className={classes.knownButton}
                onClick={entry?.known ? _markUnknown : _markKnown}
                warning
              >
                {entry?.known ? "Mark Unkown" : "Mark Known"}
              </VTButton>
            </div>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}

export default TranslationPopup;
