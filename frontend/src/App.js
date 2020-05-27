import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { LoginPage, DashboardPage } from "./components";

function App() {
  const loggedIn = false;

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/dashboard">
          <DashboardPage />
        </Route>
        <Route>
          <Redirect to={loggedIn ? "/dashboard" : "/login"} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
