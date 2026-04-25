import { Helmet } from "react-helmet";
import Heading from "../layout/Heading";
import SubHeading from "../layout/SubHeading";
import LoginForm from "./LoginForm";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

import bg from "../../images/bg_form.png";
import logo from "../../images/logo_.png";

function LoginPage() {
  return (
    <main>
      <Helmet>
        <title>Login | Holidaze</title>
        <meta name="description" content="Login | Holidaze" />
      </Helmet>

      <div className="login" style={{ backgroundImage: `url(${bg})` }}>
        <Container className="login__bg">
          <Row>
            <Col xs={12} md={5} className="login__bg--left">
              <Heading content="Login" />
              <SubHeading content="Please enter your login information!" />
            </Col>

            <Col xs={12} md={7} className="login__bg--right">
              <div className="login__logo">
                <Image src={logo} className="logo" alt="Holidaze logo" />
              </div>

              <LoginForm />
            </Col>
          </Row>
        </Container>
      </div>
    </main>
  );
}

export default LoginPage;
