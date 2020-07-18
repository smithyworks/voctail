import React, { useEffect } from "react";
import { toasts } from "../AppPage";
import Input from "@material-ui/core/Input";
import { TextField } from "@material-ui/core";

function ErrorDialogField({ numeric, error, setError, onChange, label, warning, ...props }) {
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
    <TextField error={error} onChange={_onChange} label={label} {...props} />
  );
}

export default ErrorDialogField;
