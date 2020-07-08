import React from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import cx from "clsx";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/core/styles/withStyles";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: "white",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

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
            <Avatar
              className={styles.avatar}
              src={"https://eu.ui-avatars.com/api/?name=" + avatarUrlBuilder(props.name)}
            />
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
