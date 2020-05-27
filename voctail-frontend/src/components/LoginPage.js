import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Grid, Paper, Typography as T, TextField, Button, Checkbox } from "@material-ui/core";

const useStyles = makeStyles({
  page: {
    height: "100%",
    width: "100%",
  },
  paper: {
    display: "inline-block",
    width: "400px",
    padding: "30px 20px 20px 20px",
  },
  inputs: { margin: "10px 0" },
  checkbox: { margin: "0 5px 0 -10px" },
  captions: { color: "grey", marginTop: "30px" },
});

function LoginPage({ ...props }) {
  const classes = useStyles();

  return (
    <Grid id="login-page" className={classes.page} container alignItems="center" justify="center">
      <Paper component="span" elevation={4} className={classes.paper}>
        <div className={classes.logo}>
          <T variant="h3" align="center" gutterBottom>
            VocTail
          </T>
        </div>

        <div className={classes.inputs}>
          <TextField
            variant="outlined"
            placeholder="username@example.com "
            label="Username or Email"
            fullWidth
            margin="dense"
            className={classes.inputs}
          ></TextField>

          <TextField
            variant="outlined"
            placeholder="password"
            label="Password"
            type="password"
            fullWidth
            margin="dense"
            className={classes.inputs}
          ></TextField>

          <Button color="primary" variant="contained" fullWidth className={classes.inputs} disableElevation>
            Login
          </Button>

          <Grid container alignItems="center">
            <Checkbox disableRipple disableElevation className={classes.checkbox} />
            <T display="inline">Remember Me</T>
          </Grid>
        </div>

        <div className={classes.submit}></div>

        <T className={classes.captions}>
          Don't have an account? Register <Link to="/register">here</Link>!
        </T>
      </Paper>
    </Grid>
  );
}

export default LoginPage;
