import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { tokens, api } from "../utils";

function SignoutRedirect() {
  console.log("signout");
  const [loggedOut, setLoggedOut] = useState(false);
  useEffect(() => {
    api
      .logout()
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
