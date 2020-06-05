import React from "react";
import { Grid, Typography as T} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppPage from "./AppPage.js";
// import {Link} from "reactrouter-dom";

const useStyles = makeStyles({
    container: { height: "100%", width: "100%" },
    grid: { height: "100%", width: "100%" },
    userItem: { width: "150px" },
});

function DocumentMarkup({ ...props }) {
    const classes = useStyles();

    return (
        <AppPage location="document-markup" id="document-markup-page">
            <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
                <T variant="h4">This is the document markup for your document!</T>
            </Grid>
        </AppPage>
    );
}

export default DocumentMarkup;