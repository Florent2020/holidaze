import React from "react";
import InfoHeader from "./InfoHeader";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavLink from "react-bootstrap/NavLink";
import Logo from "../../images/logo_.png";
import Image from "react-bootstrap/Image";
import Nav from "./Nav";

function Header() {
  return (
    <header className="header">
      <InfoHeader></InfoHeader>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <NavLink href="/" className="nav--logo">
            <Navbar.Brand>
              <Image src={Logo} className="logo" alt="logo" />
            </Navbar.Brand>
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
