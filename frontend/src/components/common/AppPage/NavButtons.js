import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import colors from "../../../assets/colors.json";
import { Badge } from "@material-ui/core";

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    padding: "5px 20px 0 20px",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    ...colors.topNav.button,
    "&:hover": {
      ...colors.topNav.buttonHover,
    },
  },
  activeLink: {
    textDecoration: "none",
    padding: "5px 20px 0 20px",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    ...colors.topNav.activeButton,
    "&:hover": {
      ...colors.topNav.activeButtonHover,
    },
  },
});

function NavButtons({ location, isAdmin, pendingTranslations }) {
  const classes = useStyles();

  const { path } = useRouteMatch();

  const dashboardLinkClass =
    path === "/documents/:document_id" || path === "/dashboard" ? classes.activeLink : classes.link;
  const quizzesLinkClass = path === "/quizzes" || path === "/quizzes/:id" ? classes.activeLink : classes.link;
  const classroomsLinkClass =
    path === "/classrooms" ||
    path === "/classrooms/:classroom_id" ||
    path === "/classrooms/:classroom_id/documents/:document_id"
      ? classes.activeLink
      : classes.link;
  const adminLinkClass = path === "/admin" ? classes.activeLink : classes.link;

  const adminLink = isAdmin ? (
    pendingTranslations && pendingTranslations > 0 ? (
      <Link to="/admin" className={adminLinkClass}>
        <Badge badgeContent={pendingTranslations} color="error">
          Admin
        </Badge>
      </Link>
    ) : (
      <Link to="/admin" className={adminLinkClass}>
        Admin
      </Link>
    )
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
