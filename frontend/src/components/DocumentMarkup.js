import React, { useState, useEffect } from "react";
import { Grid, Typography as T , GridList, GridListTile, ListSubheader, GridListTileBar, IconButton} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import LocalBarIcon from '@material-ui/icons/LocalBar';

import AppPage from "./AppPage.js";
import { api } from "../utils";
// import {Link} from "reactrouter-dom";

const useStyles = makeStyles({
    container: { height: "100%", width: "100%" },
    grid: { height: "100%", width: "100%" },
    userItem: { width: "150px" },
});

function DocumentMarkup({ ...props }) {
    const classes = useStyles();
    const [user, setUser] = useState();

    useEffect(() => {
        api
            .user()
            .then(res => {
                if (res) setUser(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <AppPage location="document-markup" id="document-markup-page">
            <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
                <T variant="h4">This is the document markup for your document!</T>
            </Grid>
        </AppPage>
    );
}

export default DocumentMarkup;