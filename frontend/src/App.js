import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import {
  DashboardPage,
  SigninPage,
  SignoutRedirect,
  Error404Page,
  IntroPage,
  AdminPage,
  DocumentPage,
  DocumentMarkup,
} from "./components";
import { tokens } from "./utils";

function ProtectedRoute({ ...props }) {
  if (tokens.hasTokens()) return <Route {...props} />;
  else return <Redirect to="/404" />;
}

function App() {
  return (
    <Router>
      <Switch>
        <ProtectedRoute path="/admin" component={AdminPage} />
        <ProtectedRoute path="/dashboard" component={DashboardPage} />
        <ProtectedRoute path="/documents" component={DocumentPage} />

        <Route path="/document-markup" component={DocumentMarkup} />

        <Route path="/signup">
          <SigninPage signup />
        </Route>
        <Route path="/signin" component={SigninPage} />
        <Route path="/signout" component={SignoutRedirect} />

        <Route exact path="/" component={IntroPage} />
        <Route path="/404" component={Error404Page} />
        <Route component={Error404Page} />
      </Switch>
    </Router>
  );
}

export default App;
