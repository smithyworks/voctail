import React, { useEffect } from "react";
import { toasts } from "../AppPage";
import Input from "@material-ui/core/Input";
import { TextField } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const VoctailTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "lightseagreen",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "lightseagreen",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "teal",
      },
      "&.Mui-focused fieldset": {
        borderColor: "lightseagreen",
      },
    },
  },
})(TextField);

const useStyles = makeStyles(() => ({
  voctail: {
    margin: "normal",
    display: "flex",
    flexWrap: "wrap",
  },
}));

function ErrorDialogField({ numeric, error, setError, onChange, label, warning, ...props }) {
  const classes = useStyles();

  // if(error || inputRef.current > 0)
  const _onChange = (e) => {
    onChange(e);
    if (error) {
      setError(false);
    }
  };

  useEffect(() => {
    if (error) {
      toasts.toastWarning(warning);
    }
  }, [error, warning]);

  return numeric ? (
    <Input error={error} onChange={_onChange} placeholder={label} {...props} />
  ) : (
    <VoctailTextField className={classes.margin} error={error} onChange={_onChange} label={label} {...props} />
  );
}

export default ErrorDialogField;
