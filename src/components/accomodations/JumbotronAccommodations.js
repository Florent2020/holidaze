import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Banner from "../../images/111.png";
import Container from "react-bootstrap/Container";
import Heading from "../layout/Heading";

function JumbotronAccommodations() {
  return (
    <Jumbotron className="page" style={{ backgroundImage: `url(${Banner})` }}>
      <div className="shadow--banner"></div>
      <Container>
        <div className="shadow--text accommodations--banner">
          <h6>Bergen</h6>
          <Heading content="Holidaze" />
          <p>A local icon website of Norwegian accommodations!</p>
        </div>
      </Container>
    </Jumbotron>
  );
}

export default JumbotronAccommodations;
