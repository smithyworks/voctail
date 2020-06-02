import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import { DashboardPage, SigninPage, SignoutRedirect, Error404Page, IntroPage, AdminPage } from "./components";
import { tokens } from "./utils";

function ProtectedRoute(props) {
  if (tokens.hasTokens()) return <Route {...props} />;
  else return <Redirect to="/404" />;
}

function App() {
  return (
    <Router>
      <Switch>
        <ProtectedRoute path="/admin" component={AdminPage} />
        <ProtectedRoute path="/signout" component={SignoutRedirect} />
        <ProtectedRoute path="/dashboard" component={DashboardPage} />

        <Route path="/signup">
          <SigninPage signup />
        </Route>
        <Route path="/signin" component={SigninPage} />

        <Route exact path="/" component={IntroPage} />
        <Route path="/404" component={Error404Page} />
        <Route component={Error404Page} />
      </Switch>
    </Router>
  );
}

export default App;
