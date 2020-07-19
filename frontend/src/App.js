import React, { useState, useEffect, useContext, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import {
  DashboardPage,
  SigninPage,
  SignoutRedirect,
  Error404Page,
  AdminPage,
  DocumentPage,
  QuizzesDashboardPage,
  QuizPage,
  ClassroomsPage,
  ClassroomViewPage,
  AccountPage,
  ProfilePage,
} from "./components";
import { toasts } from "./components/common";
import { localStorage, api } from "./utils";
import ShowcasePage from "./components/common/ShowcasePage";
import { getColor } from "./components/common/Quiz/colorCycler";

function ProtectedRoute({ redirectTo, path, ...props }) {
  if (localStorage.hasTokens()) return <Route path {...props} />;
  else
    return (
      <Route path={path}>
        <Redirect to={redirectTo} />
      </Route>
    );
}

function AdminRoute({ ...props }) {
  const user = useContext(UserContext);
  if (!user.user_id) return null;
  if (user.admin) return <Route {...props} />;
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
  const backgroundColor = useRef(getColor());
  useEffect(() => {
    if (loggedIn)
      api
        .user()
        .then((res) => {
          if (res) setUser({ ...res.data, backgroundColor: backgroundColor.current });
        })
        .catch((err) => toasts.toastError("Error communicating with the server!"));
  }, [loggedIn, count]);

  return (
    <UserContext.Provider value={user}>
      <Router>
        <Switch>
          <AdminRoute path="/showcase" component={ShowcasePage} />
          <AdminRoute path="/admin" component={AdminPage} />
          <ProtectedRoute path="/dashboard" component={DashboardPage} />
          <ProtectedRoute path="/quizzes/:id" component={QuizPage} />
          <ProtectedRoute path="/quizzes" component={QuizzesDashboardPage} />
          <ProtectedRoute path="/documents/:document_id" component={DocumentPage} />
          <ProtectedRoute path="/classrooms/:classroom_id/documents/:document_id" component={DocumentPage} />
          <ProtectedRoute path="/classrooms/:classroom_id" component={ClassroomViewPage} />
          <ProtectedRoute path="/classrooms" component={ClassroomsPage} />
          <ProtectedRoute path="/account" component={AccountPage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/users/:user_id" component={ProfilePage} />
          <Route path="/signup">
            <SigninPage signup />
          </Route>
          <Route path="/signin" component={SigninPage} />
          <Route path="/signout" component={SignoutRedirect} />

          <ProtectedRoute exact path="/" redirectTo="/signin">
            <Redirect to="/dashboard" />
          </ProtectedRoute>

          <Route path="/404" component={Error404Page} />
          <Route>
            <Redirect to="/404" />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
