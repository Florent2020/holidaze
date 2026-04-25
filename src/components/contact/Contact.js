import { Helmet } from "react-helmet";
import Heading from "../layout/Heading";
import SubHeading from "../layout/SubHeading";
import ContactForm from "./ContactForm";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import bg from "../../images/bg_form.png";
import Nav from "react-bootstrap/Nav";

function Contact() {
  return (
    <main>
      <Helmet>
        <title>Contact | Holidaze!</title>
        <meta
          name="description"
          content="Do you need help? Feel free and Contact Us at contact form of Holidaze!"
        />
      </Helmet>

      <div className="contact" style={{ backgroundImage: `url(${bg})` }}>
        <Container className="contact__bg">
          <Row>
            <Col xs={12} md={5} className="contact__bg--left">
              <SubHeading content="Info" />
              <div>Sed ut perspiciatis, 12345 Bergen, Norway</div>
              <div>123 456 789</div>
              <div>info@holidaze.com</div>
              <div className="social--media">
                <Nav.Link href="#">
                  <i className="fab fa-facebook-f"></i>
                </Nav.Link>
                <Nav.Link eventKey="#">
                  <i className="fab fa-twitter"></i>
                </Nav.Link>
                <Nav.Link eventKey="#">
                  <i className="fab fa-instagram"></i>
                </Nav.Link>
              </div>
            </Col>
            <Col xs={12} md={7} className="contact__bg--right">
              <div className="contact__logo">
                <Heading content="Send us a message" />
              </div>
              <ContactForm />
            </Col>
          </Row>
        </Container>
      </div>
    </main>
  );
}

export default Contact;
