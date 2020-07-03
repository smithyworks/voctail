import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import colors from "../../../assets/colors.json";

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    padding: "0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    ...colors.topNav.button,
    "&:hover": {
      ...colors.topNav.buttonHover,
    },
  },
  activeLink: {
    textDecoration: "none",
    padding: "0 20px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    ...colors.topNav.activeButton,
    "&:hover": {
      ...colors.topNav.activeButtonHover,
    },
  },
});

function NavButtons({ location, isAdmin }) {
  const classes = useStyles();

  const dashboardLinkClass = location === "dashboard" ? classes.activeLink : classes.link;
  // const documentsLinkClass = location === "documents" ? classes.activeLink : classes.link;
  const quizzesLinkClass = location === "quizzes" ? classes.activeLink : classes.link;
  const classroomsLinkClass = location === "classrooms" ? classes.activeLink : classes.link;
  const adminLinkClass = location === "admin" ? classes.activeLink : classes.link;

  const adminLink = isAdmin ? (
    <Link to="/admin" className={adminLinkClass}>
      Admin
    </Link>
  ) : null;

  return (
    <>
      <Link to="/dashboard" className={dashboardLinkClass}>
        Dashboard
      </Link>
      <Link to="/quizzes" className={quizzesLinkClass}>
        Quizzes
      </Link>
      <Link to="/classrooms" className={classroomsLinkClass}>
        Classrooms
      </Link>
      {adminLink}
    </>
  );
}

export default NavButtons;
