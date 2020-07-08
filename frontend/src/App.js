import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import {
  DashboardPage,
  SigninPage,
  SignoutRedirect,
  Error404Page,
  IntroPage,
  AdminPage,
  DocumentPage,
  QuizzesDashboardPage,
  QuizPage,
  ClassroomsPage,
  ClassroomsCreatePage,
  ClassroomViewPage,
  AccountPage,
  ProfilePage,
} from "./components";
import { toasts } from "./components/common";
import { localStorage, api } from "./utils";
import ShowcasePage from "./components/common/ShowcasePage";

function ProtectedRoute({ ...props }) {
  if (localStorage.hasTokens()) return <Route {...props} />;
  else return <Redirect to="/404" />;
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
  useEffect(() => {
    if (loggedIn)
      api
        .user()
        .then((res) => {
          if (res) setUser(res.data);
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
          <ProtectedRoute path="/classrooms/create" component={ClassroomsCreatePage} />
          <ProtectedRoute path="/classrooms/view" component={ClassroomViewPage} />
          <ProtectedRoute path="/classrooms" component={ClassroomsPage} />
          <ProtectedRoute path="/account" component={AccountPage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/users/:user_id" component={ProfilePage} />

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
