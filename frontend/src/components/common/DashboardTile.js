import React, { useState, useRef } from "react";
import { Paper, makeStyles, Grid, Typography, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Link } from "react-router-dom";

//example tile images
import shortStoriesPreview from "../../assets/books.jpg";
import fairyTalesPreview from "../../assets/fairytale.jpg";
import newspaperArticlesPreview from "../../assets/newspaper.jpg";
import otherDocumentsPreview from "../../assets/others.jpg";

const useStyles = makeStyles({
  container: {
    padding: "10px",
    height: "190px",
  },
  paper: {
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "relative",
    cursor: "pointer",
    display: "inline-block",
    overflow: "hidden",
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: "70px",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: "5px 10px",
  },
  title: {
    color: "white",
    fontSize: "18px",
  },
  author: { color: "white", fontWeight: "lighter", fontStyle: "italic" },
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
});

function DashboardTile({ title, author, level, onDelete, isOwned, onEdit, onGenerateQuiz, linkTo, category }) {
  const classes = useStyles();

  const [hovered, setHovered] = useState(false);

  const anchor = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  function openMenu(e) {
    setMenuOpen(true);
    e.preventDefault();
    e.stopPropagation();
  }

  let thumbnail;
  switch (category) {
    case "(Short) Story":
      thumbnail = shortStoriesPreview;
      break;
    case "Fairy Tale":
      thumbnail = fairyTalesPreview;
      break;
    case "Newspaper Article":
      thumbnail = newspaperArticlesPreview;
      break;
    default:
      thumbnail = otherDocumentsPreview;
  }

  function _onDelete(e) {
    if (typeof onDelete === "function") onDelete(e);
  }
  function _onEdit(e) {
    if (typeof onEdit === "function") onEdit(e);
  }
  function _onGenerateQuiz(e) {
    if (typeof onGenerateQuiz === "function") onGenerateQuiz(e);
  }

  return (
    <Grid item xs={12} sm={6} md={3} lg={3} className={classes.container}>
      <Paper
        className={classes.paper}
        style={{ backgroundImage: `url(${thumbnail})` }}
        elevation={hovered ? 5 : 2}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        component={Link}
        to={linkTo}
      >
        <div className={classes.infoContainer}>
          <Typography className={classes.title}>{title}</Typography>
          <Typography className={classes.author}>written by {author}</Typography>
        </div>

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
        <MenuItem onClick={_onEdit}>Edit</MenuItem>
        <MenuItem onClick={_onDelete}>Delete</MenuItem>
        <MenuItem onClick={_onGenerateQuiz}>Create Quiz</MenuItem>
      </Menu>
    </Grid>
  );
}

export default DashboardTile;
