import React from "react";
import Card from "@material-ui/core/Card";
import cx from "clsx";
import CardContent from "@material-ui/core/CardContent";
import { Avatar, Box } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { display } from "@material-ui/system";

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

const useStyles = makeStyles(() => ({
  actionArea: {
    borderRadius: 16,
    transition: "0.2s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  card: {
    borderRadius: 12,
    minWidth: 256,
    backgroundColor: "#D4E4E4",
    textAlign: "center",
    boxShadow: "1px 1px 6px #555",
  },
  avatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: "0.5px",
    marginTop: 8,
    marginBottom: 0,
  },
  subheader: {
    fontSize: 14,
    marginBottom: "0.875em",
  },
}));

function avatarUrlBuilder(name) {
  const parser = name.split(" ");
  if (parser.length === 2) {
    return parser[0] + "+" + parser[1];
  } else return name;
}

function UserCard(props) {
  const styles = useStyles();
  if (props.initials !== false) {
    return (
      <Card className={cx(styles.card, styles.actionArea)}>
        <LightTooltip title={props.tip}>
          <CardContent>
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
            <h3 className={styles.heading}>{props.name}</h3>
            <span className={styles.subheader}>{props.email}</span>
          </CardContent>
        </LightTooltip>
      </Card>
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
