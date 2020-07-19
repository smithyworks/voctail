import { Checkbox } from "@material-ui/core";
import React from "react";

function VoctailCheckbox({ ...props }) {
  return (
    <Checkbox
      {...props}
      style={{
        color: "lightseagreen",
      }}
    />
  );
}
export default VoctailCheckbox;
