import React from "react";
import { Link } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Banner from "../../images/banner_.png";
import Container from "react-bootstrap/Container";
import Heading from "../layout/Heading";
import Button from "react-bootstrap/Button";

function JumbotronPage() {
  return (
    <Jumbotron style={{ backgroundImage: `url(${Banner})` }}>
      <div className="shadow--banner"></div>
      <Container>
        <div className="shadow--text">
          <Heading content="World Class Accommodation!" />
          <p>
            Discover Hotels, Apartments, B&B's, Guesthouses that defines a new
            dimension of luxury!
          </p>
          <Link to="./accommodations">
            <Button variant="primary">Discover</Button>
          </Link>
        </div>
      </Container>
    </Jumbotron>
  );
}

export default JumbotronPage;
