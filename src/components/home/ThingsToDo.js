import React from "react";
import SubHeading from "../layout/SubHeading";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import image1 from "../../images/bergen_1.jpg";
import image2 from "../../images/bergen_2.jpg";
import image3 from "../../images/bergen_3.jpg";
import image4 from "../../images/bergen_4.jpg";

function ThingsToDo() {
  return (
    <div className="things--to--do">
      <div className="things--to--do__subheading">
        <SubHeading content="Things to do in Bergen!" />
      </div>
      <Container>
        <Row>
          <Col xs={12} md={6} lg={3}>
            <Card className="dark--card">
              <Card.Img variant="top" src={image1} alt="Bergen" />
              <Card.Body>
                <Card.Title>Marvel at colorful Bryggen</Card.Title>
                <Card.Text>
                  This UNESCO World Heritage site is the iconic poster site for
                  Bergen. The colourful row of toy-like houses is the most
                  recognizable landmark of the city.
                </Card.Text>
              </Card.Body>
              <Card.Link
                className="on--hover"
                href="https://blog.eurail.com/things-to-do-in-bergen-norway/"
                target="_blank"
              >
                Read more!
              </Card.Link>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Card className="dark--card">
              <Card.Img variant="top" src={image2} alt="Bergen" />
              <Card.Body>
                <Card.Title>Get out onto the water</Card.Title>
                <Card.Text>
                  You can’t go to Bergen and miss out on the magnificent
                  surroundings that make this destination so popular. A fjord
                  cruise is an absolute must and arguably the most popular
                  attraction in Scandinavia.
                </Card.Text>
              </Card.Body>
              <Card.Link
                className="on--hover"
                href="https://blog.eurail.com/things-to-do-in-bergen-norway/"
                target="_blank"
              >
                Read more!
              </Card.Link>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Card className="dark--card">
              <Card.Img variant="top" src={image3} alt="Bergen" />
              <Card.Body>
                <Card.Title>Visit the aquarium</Card.Title>
                <Card.Text>
                  The aquarium is a nice break from the city. It’s small and
                  cozy. It’s a great place to take your kids, and also the
                  perfect place to bring out the inner child in you.
                </Card.Text>
              </Card.Body>
              <Card.Link
                className="on--hover"
                href="https://blog.eurail.com/things-to-do-in-bergen-norway/"
                target="_blank"
              >
                Read more!
              </Card.Link>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Card className="dark--card">
              <Card.Img variant="top" src={image4} alt="Bergen" />
              <Card.Body>
                <Card.Title>Enjoy panoramic views at Mount Fløyen</Card.Title>
                <Card.Text>
                  Take the funicular to the top for stunning panoramic views
                  over the city and surrounding landscapes. The viewing platform
                  is a great spot to enjoy the sunset.
                </Card.Text>
              </Card.Body>
              <Card.Link
                className="on--hover"
                href="https://blog.eurail.com/things-to-do-in-bergen-norway/"
                target="_blank"
              >
                Read more!
              </Card.Link>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ThingsToDo;
