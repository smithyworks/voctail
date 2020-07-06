import React from "react";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import cx from "clsx";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((palette) => ({
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

function UserCard(props) {
  const styles = useStyles();
  return (
    <Card className={cx(styles.card, styles.actionArea)}>
      <CardContent>
        <Avatar className={styles.avatar} src={props.avatar} />
        <h3 className={styles.heading}>{props.name}</h3>
        <span className={styles.subheader}>{props.email}</span>
      </CardContent>
    </Card>
  );
}

export default UserCard;
