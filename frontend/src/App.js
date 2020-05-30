import React from "react";
import { tokens } from "./utils";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import { DashboardPage, SigninPage, SignoutRedirect, Error404Page, IntroPage } from "./components";

function App() {
  const [accessToken, refreshToken] = tokens.getTokens();
  console.log("Routing.  hasTokens =", !!(accessToken && refreshToken));

  function ProtectedRoute(props) {
    const [accessToken, refreshToken] = tokens.getTokens();
    if (accessToken && refreshToken) return <Route {...props} />;
    else return null;
  }

  function DashboardRedirect() {
    console.log("redirect to dashboard");
    return <Redirect to="/dashboard" />;
  }

  function SigninRedirect() {
    console.log("redirect to sign in");
    return <Redirect to="/signin" />;
  }

  return (
    <Router>
      <Switch>
        <ProtectedRoute path="/signout" component={SignoutRedirect} />
        <ProtectedRoute path="/dashboard" component={DashboardPage} />

        <Route path="/signup">
          <SigninPage signup />
        </Route>
        <Route path="/signin" component={SigninPage} />

        <Route exact path="/" component={IntroPage} />
        <Route>
          <Error404Page />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
