import React from "react";
import { Segment, Container } from 'semantic-ui-react'

function Jumbotron({ children }) {
  return (
    <Segment
      style={{ height: 560, clear: "both", paddingTop: 120, textAlign: "center" }}
    >
      <Container>
        {children}
      </Container>
    </Segment>
  );
}

export default Jumbotron;