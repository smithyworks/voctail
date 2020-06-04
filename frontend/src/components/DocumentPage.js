import React, { useState, useEffect } from "react";
import { Grid, Typography as T , GridList, GridListTile, ListSubheader, GridListTileBar, IconButton} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LocalBarIcon from '@material-ui/icons/LocalBar';

import AppPage from "./AppPage.js";
import { api } from "../utils";

import tileData from './tileData.js';
import {Link} from "react-router-dom";



const useStyles = makeStyles({
    container: { height: 200, width: "100%" },
    grid: { height: 100, width: "100%" },
    userItem: { width: "150px" },

    //gridlist with documents
    root: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.54)', },
    gridList: { width: "100%", height: 800, justifyContent: 'space-around'},
    icon: {color: 'rgba(255,255,255,0.54)'},
});

function Documents({ ...props}, location) {
    const classes = useStyles();
    const [user, setUser] = useState();
    //todo integrate flexible link to individual documents instead of const document markup
    const documentMarkupLinkClass = location ==="document-markup" ? classes.activeLink : classes.link;


    useEffect(() => {
        api
            .user()
            .then(res => {
                if (res) setUser(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <AppPage location="documents" id="documents-page">
        <Grid className={classes.grid} container justify="center" alignItems="center" direction="column">
            <T variant="h4">Welcome to your Document Overview, {user ? user.name : "..."}!</T>
        </Grid>

            <GridList cellHeight={200} cols={3} container justify="center" alignItems="center" className={classes.gridList}>
                <GridListTile key="Subheader" cols={3} style={{ height: 'auto' }}>
                    <ListSubheader component="div">Documents</ListSubheader>
                </GridListTile>
                {tileData.map((tile) => (
                    <GridListTile key={tile.img} cols={1}>
                        <img src={tile.img} alt={tile.title} />
                        <GridListTileBar
                            title={
                                <Link to="/document-markup" className={documentMarkupLinkClass}>
                                    {tile.title}
                                </Link>
                                }
                            subtitle={<span>description: {tile.description}</span>}
                            actionIcon={
                                <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
                                    <LocalBarIcon />
                                </IconButton>
                            }

                        />
                        //documentMarkupLinkClass = location === "document-markup" ? classes.activeLink : classes.link;

                    </GridListTile>
                ))}
            </GridList>

    </AppPage>
);
}

export default Documents;