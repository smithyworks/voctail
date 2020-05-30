import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { tokens, requests as r } from "../utils";

function SignoutRedirect() {
  console.log("signout");
  const [loggedOut, setLoggedOut] = useState(false);
  useEffect(() => {
    r.logout()
      .then(res => {
        console.log(res.status);
      })
      .catch(error => {
        console.log("error logging out");
        console.log(error);
      })
      .then(res => {
        tokens.flushTokens();
        setLoggedOut(true);
      });
  }, []);

  let content = <Redirect to="/signin" />;
  if (!loggedOut) {
    content = <div>Signin out...</div>;
  }

  return <div id="signout">{content}</div>;
}

export default SignoutRedirect;
