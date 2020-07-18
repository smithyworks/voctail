import React, { useState, useRef } from "react";
import { Paper, makeStyles, Grid, Typography, Menu, MenuItem, Badge, withStyles, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ProfilePicture from "../ProfilePage/ProfilePicture";

const StyledBadgeConnected = withStyles((theme) => ({
  badge: {
    bottom: "7%",
    right: "7%",
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const StyledBadgeDisconnected = withStyles((theme) => ({
  badge: {
    bottom: "7%",
    right: "7%",
    backgroundColor: "grey",
    color: "grey",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}))(Badge);

const useStyles = makeStyles({
  container: {
    padding: "10px 10px 5px 10px",
  },
  paper: {
    width: "100%",
    height: "175px",
    position: "relative",
    cursor: "pointer",
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    textDecoration: "none",
    padding: "20px",
  },
  name: {
    paddingTop: "5px",
    fontSize: "22px",
    fontWeight: "bolder",
  },
  email: {
    fontSize: "16px",
    color: "#555",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
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
  connected: {
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  disconnected: {
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
});

function UserTile({ user, tooltipTitle, connected, linkTo }) {
  const classes = useStyles();
  const { name, email, user_id } = user;

  const [hovered, setHovered] = useState(false);

  const anchor = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  function openMenu(e) {
    setMenuOpen(true);
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <Grid item xs={12} sm={6} md={3} lg={3} className={classes.container}>
      <Tooltip title={tooltipTitle} enterDelay={1000} enterNextDelay={1000}>
        <Paper
          className={classes.paper}
          elevation={hovered ? 5 : 2}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <StyledBadgeConnected
            invisible={!connected}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            <StyledBadgeDisconnected
              invisible={connected}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <ProfilePicture user={user} dimension="80px" fontSize="36px" />
            </StyledBadgeDisconnected>
          </StyledBadgeConnected>
          <Typography className={classes.name} noWrap align="center">
            {name}
          </Typography>
          <Typography className={classes.email} noWrap align="center" component="a" href={`mailto:${email}`}>
            {email}
          </Typography>

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
        <MenuItem component="a" href={`mailto:${email}`}>
          Send Email
        </MenuItem>
        <MenuItem component={Link} to={`/users/${user_id}`}>
          View Information
        </MenuItem>
      </Menu>
    </Grid>
  );
}

export default UserTile;
