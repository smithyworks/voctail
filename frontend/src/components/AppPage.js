import React from "react";
import { Container } from "@material-ui/core";

import TopNav from "./TopNav";
import { tokens } from "../utils";

// The AppPage is meant to be rendered directly into the id="root" element.

function AppPage({ children, id, location }) {
  return (
    <>
      <TopNav location={location} loggedIn={tokens.hasTokens()} />
      <Container id={id} style={{ height: "100%", padding: "60px 0 10px 0" }}>
        {children}
      </Container>
    </>
  );
}

export default AppPage;
