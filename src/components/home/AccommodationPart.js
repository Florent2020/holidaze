import React from "react";
import { Container } from "react-bootstrap";
import SubHeading from "../layout/SubHeading";

function AccommodationPart() {
  return (
    <div className="accommodation--list">
      <Container>
        <div className="accommodation--list__subheading">
          <SubHeading content="List of Hotels, Apartments, B&B's, Guesthouses " />
        </div>
      </Container>
    </div>
  );
}

export default AccommodationPart;
