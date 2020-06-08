import React, { useState, useEffect } from "react";
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
  QuizzesPage,
  QuizzesSavedPage,
  QuizzesDayPage,
  ClassroomsPage,
} from "./components";
import { localStorage, api } from "./utils";

function ProtectedRoute({ ...props }) {
  if (localStorage.hasTokens()) return <Route {...props} />;
  else return <Redirect to="/404" />;
}

const refreshCallback = {};
export function refresh() {
  const cb = refreshCallback.current;
  if (typeof cb === "function") cb();
}

export const UserContext = React.createContext();

function App() {
  const [count, setCount] = useState(0);
  refreshCallback.current = () => setCount(count + 1);

  const loggedIn = localStorage.hasTokens();
  const [user, setUser] = useState(localStorage.getUser());
  useEffect(() => {
    if (loggedIn)
      api
        .user()
        .then((res) => {
          if (res) setUser(res.data);
        })
        .catch((err) => console.log(err));
  }, [loggedIn]);

  return (
    <UserContext.Provider value={user}>
      <Router>
        <Switch>
          <ProtectedRoute path="/admin" component={AdminPage} />
          <ProtectedRoute path="/dashboard" component={DashboardPage} />
          <ProtectedRoute path="/quizzes/saved" component={QuizzesSavedPage} />
          <ProtectedRoute path="/quizzes/day" component={QuizzesDayPage} />
          <ProtectedRoute path="/quizzes" component={QuizzesPage} />
          <ProtectedRoute path="/documents" component={DocumentPage} />
          <ProtectedRoute path="/classrooms" component={ClassroomsPage} />

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
    </UserContext.Provider>
  );
}

export default App;
