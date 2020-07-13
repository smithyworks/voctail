import React, { useState } from "react";
import { Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import AppPage from "../common/AppPage";
import UsersTabPanel from "./UsersTabPanel";

const useStyles = makeStyles({
  tabs: { marginTop: "10px" },
});

function AdminPage({ ...props }) {
  const classes = useStyles();

  const [tab, setTab] = useState(0);

  return (
    <AppPage id="admin-page" location="admin">
      <Tabs value={tab} onChange={(e, v) => setTab(v)} className={classes.tabs}>
        <Tab value={0} label="users" />
        <Tab value={1} label="translations" />
      </Tabs>
      {tab === 0 && <UsersTabPanel />}
      {tab === 1 && "Translations"}
    </AppPage>
  );
}

export default AdminPage;
