import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { localStorage, api } from "../utils";

function SignoutRedirect({ onSignout }) {
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
        if (typeof onSignout === "function") onSignout();
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
