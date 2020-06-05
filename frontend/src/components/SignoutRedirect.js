import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { tokens, api } from "../utils";

function SignoutRedirect() {
  const [loggedOut, setLoggedOut] = useState(false);
  useEffect(() => {
    api
      .logout()
      .catch((error) => {
        console.log(error);
      })
      .finally((res) => {
        tokens.flushTokens();
        setLoggedOut(true);
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
