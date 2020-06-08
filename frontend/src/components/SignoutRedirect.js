import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { localStorage, api } from "../utils";
import { refresh } from "../App.js";

function SignoutRedirect() {
  const [loggedOut, setLoggedOut] = useState(false);
  useEffect(() => {
    api
      .logout()
      .catch((error) => {
        console.log(error);
      })
      .finally((res) => {
        localStorage.flushTokens();
        setLoggedOut(true);
        refresh();
      });
  }, []);

  if (loggedOut) return <Redirect to="/" />;
  else {
    return (
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justify: "center" }}>
        Signin out...
      </div>
    );
  }
}

export default SignoutRedirect;
