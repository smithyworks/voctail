import React, { useState, useRef } from "react";
import { Paper, makeStyles, Grid, Typography, Menu, MenuItem, LinearProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { getColor } from "./colorCycler";

const useStyles = makeStyles({
  container: {
    padding: "10px",
  },
  paper: {
    width: "100%",
    height: "175px",
    position: "relative",
    cursor: "pointer",
    display: "inline-block",
    overflow: "hidden",
    color: "white",
    textDecoration: "none",
    padding: "40px 20px 10px 20px",
  },
  name: {
    color: "white",
    fontSize: "24px",
    fontWeight: "bolder",
  },
  menuIconContainer: {
    display: "inline-block",
    position: "absolute",
    top: "0",
    padding: "5px 2px 1px 2px",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderBottomLeftRadius: 4,
    "&:hover": {
      backgroundColor: "black",
    },
  },
  menuIconIn: {
    right: "0",
    transition: "right 300ms",
  },
  menuIconOut: {
    right: "-30px",
    transition: "right 400ms",
  },
  progressContainer: {
    padding: "20px 0",
  },
  progress: {
    height: "7px",
    border: "1px solid white",
    borderRadius: "3px",
    backgroundColor: "transparent",
  },
  progressBar: {
    backgroundColor: "white",
  },
  infoTextContainer: { paddingTop: "10px" },
  progressText: {
    fontWeight: "lighter",
  },
  lastSeenText: { fontWeight: "lighter", fontStyle: "italic" },
});

function QuizTile({ name, isOwned, onDelete, onEdit, linkTo, progress }) {
  const classes = useStyles();
  const backgroundColor = useRef(getColor());

  const [hovered, setHovered] = useState(false);

  const anchor = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  function openMenu(e) {
    setMenuOpen(true);
    e.preventDefault();
    e.stopPropagation();
  }

  function _onDelete(e) {
    if (typeof onDelete === "function") {
      onDelete(e);
      setMenuOpen(false);
    }
  }
  function _onEdit(e) {
    if (typeof onDelete === "function") {
      onEdit(e);
      setMenuOpen(false);
    }
  }

  return (
    <Grid item xs={12} sm={6} md={3} lg={3} className={classes.container}>
      <Paper
        className={classes.paper}
        style={{ backgroundColor: backgroundColor.current }}
        elevation={hovered ? 5 : 2}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        component={Link}
        to={linkTo}
      >
        <Typography className={classes.name}>{name}</Typography>

        <div className={classes.progressContainer}>
          <LinearProgress
            value={progress}
            variant="determinate"
            className={classes.progress}
            classes={{ bar: classes.progressBar }}
          />
        </div>

        <Grid container justify="space-between" className={classes.infoTextContainer}>
          <Grid item>
            <Typography className={classes.progressText}>{progress}%</Typography>
          </Grid>
          <Grid item>
            <Typography align="right" className={classes.lastSeenText}>
              last seen ...
            </Typography>
          </Grid>
        </Grid>

        {!!isOwned && (
          <div
            className={`${classes.menuIconContainer} ${hovered ? classes.menuIconIn : classes.menuIconOut}`}
            onClick={openMenu}
            ref={anchor}
          >
            <MoreVertIcon />
          </div>
        )}
      </Paper>

      <Menu anchorEl={anchor.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuItem onClick={_onEdit}>Rename</MenuItem>
        <MenuItem onClick={_onDelete}>Delete</MenuItem>
      </Menu>
    </Grid>
  );
}

export default QuizTile;
