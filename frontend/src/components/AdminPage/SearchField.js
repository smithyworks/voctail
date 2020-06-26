import React, { useRef } from "react";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/styles";
import _ from "lodash";

const useStyles = makeStyles({
  iconButton: { height: "35px", width: "35px", marginLeft: "-5px" },
  searchIcon: {
    color: "darkgrey",
  },
});

function SearchField({ onSearch }) {
  const classes = useStyles();

  const searchString = useRef();
  const _search = _.throttle(() => {
    const s = searchString.current;
    if (typeof onSearch === "function") onSearch(s);
  }, 700);

  return (
    <TextField
      onChange={(e) => {
        searchString.current = e.target.value;
        _search();
      }}
      variant="outlined"
      margin="dense"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton className={classes.iconButton}>
              <SearchIcon className={classes.searchIcon} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchField;
