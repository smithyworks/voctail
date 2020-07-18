import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import cx from "clsx";
import CardContent from "@material-ui/core/CardContent";
import { Avatar, Grid, Paper, Typography } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: "white",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const StyledBadgeConnected = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
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
    backgroundColor: "grey",
    color: "grey",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
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
}))(Badge);

const useStyles = makeStyles((color) => ({
  actionArea: {
    transition: "0.2s",
    "&:hover": {
      boxShadow: "0px 0px 5px  #D3D0D0",
    },
  },
  card: {
    minWidth: 256,
    backgroundColor: "white",
    textAlign: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  heading: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: "0.5px",
    marginTop: "20px",
    marginBottom: "5px",
  },
  subheader: {
    fontSize: 14,
  },
  container: {
    padding: "10px",
  },
  paperStudent: {
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
  paperTeacher: {
    width: "100%",
    height: "175px",
    position: "relative",
    cursor: "pointer",
    display: "inline-block",
    overflow: "hidden",
    color: "white",
    backgroundColor: "lightsteelblue",
    textDecoration: "none",
    padding: "40px 20px 10px 20px",
  },
  name: {
    fontSize: "24px",
    fontWeight: "bolder",
    paddingBottom: "20%",
  },
  menuIconContainer: {
    display: "inline-block",
    position: "absolute",
    top: "0",
    padding: "5px 2px 1px 2px",
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
  teacher: { fontWeight: "lighter", fontStyle: "italic" },
}));

function avatarUrlBuilder(name) {
  const parser = name.split(" ");
  if (parser.length === 2) {
    return parser[0] + "+" + parser[1];
  } else return name;
}

function UserCard(props) {
  const styles = useStyles();
  const [hovered, setHovered] = useState(false);
  if (props.initials !== false) {
    return (
      <LightTooltip title={props.tip}>
        <Paper
          className={props.teacher ? styles.paperTeacher : styles.paperStudent}
          elevation={hovered ? 5 : 2}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          component={Link}
          to={props.linkTo}
        >
          <Grid container direction="column" alignItems="center" justify="space-between">
            <Grid item>
              <StyledBadgeConnected
                invisible={!props.connected}
                overlap="circle"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
              >
                <StyledBadgeDisconnected
                  invisible={props.connected}
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  variant="dot"
                >
                  <Avatar
                    className={styles.avatar}
                    src={"https://eu.ui-avatars.com/api/?name=" + avatarUrlBuilder(props.name)}
                  />
                </StyledBadgeDisconnected>
              </StyledBadgeConnected>
            </Grid>
            <Grid item>
              <Typography className={styles.heading} variant="h3">
                {props.name}
              </Typography>
            </Grid>
            <Grid item>
              <a className={styles.subheader} href={"mailto:" + props.email}>
                {props.email}
              </a>
            </Grid>
          </Grid>
        </Paper>
      </LightTooltip>
    );
  } else {
    return (
      <Card className={cx(styles.card, styles.actionArea)}>
        <CardContent>
          <Avatar className={styles.avatar} />
          <h3 className={styles.heading}>{props.name}</h3>
          <span className={styles.subheader}>{props.email}</span>
        </CardContent>
      </Card>
    );
  }
}

export default UserCard;
