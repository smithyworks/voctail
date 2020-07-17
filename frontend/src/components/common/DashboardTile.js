import React, { useState, useRef } from "react";
import { Paper, makeStyles, Grid, Typography, Menu, MenuItem, Tooltip } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Link } from "react-router-dom";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import LocalBarOutlinedIcon from "@material-ui/icons/LocalBarOutlined";

//example tile images
import shortStoriesPreview from "../../assets/books.jpg";
import fairyTalesPreview from "../../assets/fairytale.jpg";
import newspaperArticlesPreview from "../../assets/newspaper.jpg";
import otherDocumentsPreview from "../../assets/others.jpg";
import musicVideoPreview from "../../assets/music.jpg";

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
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: "5px 10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  title: {
    color: "white",
    fontSize: "16px",
  },
  author: { color: "white", fontWeight: "lighter", fontStyle: "italic", fontSize: "14px" },
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
  voctailFitGlass: {
    color: "white",
  },
});

function DashboardTile({ title, author, onDelete, isOwned, onEdit, onGenerateQuiz, linkTo, category, fits }) {
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
    case "music-video":
      thumbnail = musicVideoPreview;
      break;
    default:
      thumbnail = otherDocumentsPreview;
  }

  function _onDelete(e) {
    if (typeof onDelete === "function") {
      onDelete(e);
      setMenuOpen(false);
    }
  }
  function _onEdit(e) {
    if (typeof onEdit === "function") {
      onEdit(e);
      setMenuOpen(false);
    }
  }
  function _onGenerateQuiz(e) {
    if (typeof onGenerateQuiz === "function") {
      onGenerateQuiz(e);
      setMenuOpen(false);
    }
  }

  return (
    <Grid item xs={12} sm={6} md={3} lg={3} className={classes.container}>
      <Tooltip
        title={
          <>
            <div style={{ textAlign: "center" }}>{title}</div>
            <div style={{ fontStyle: "italic", textAlign: "center" }}>{author}</div>
          </>
        }
        enterDelay={1000}
        enterNextDelay={1000}
      >
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
            <Typography className={classes.title} noWrap>
              {title}
            </Typography>
            <Typography className={classes.author} noWrap>
              written by {author}
            </Typography>
          </div>

          <div className={classes.voctailFitGlass}>{fits ? <LocalBarIcon /> : <LocalBarOutlinedIcon />}</div>

          <div
            className={`${classes.menuIconContainer} ${hovered ? classes.menuIconIn : classes.menuIconOut}`}
            onClick={openMenu}
            ref={anchor}
          >
            <MoreVertIcon />
          </div>
        </Paper>
      </Tooltip>
      <Menu anchorEl={anchor.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
        {!!isOwned && (
          <div>
            <MenuItem onClick={_onEdit}>Edit</MenuItem>
            <MenuItem onClick={_onDelete}>Delete</MenuItem>
          </div>
        )}
        <MenuItem onClick={_onGenerateQuiz}>Create Quiz</MenuItem>
      </Menu>
    </Grid>
  );
}

export default DashboardTile;
