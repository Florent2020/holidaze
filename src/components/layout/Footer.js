import React from "react";
import FooterImage from "../../images/footer_image.jpg";
import logo from "../../images/logo_.png";
import Card from "react-bootstrap/Card";
import NavLink from "react-bootstrap/NavLink";
import Nav from "react-bootstrap/Nav";

function Footer() {
  return (
    <footer style={{ backgroundImage: `url(${FooterImage})` }}>
      <div className="footer">
        <div className="logo--footer">
          <Card.Img variant="top" src={logo} alt="logo" className="logo" />
        </div>
        <div className="accommodation--footer">
          <NavLink href="/accommodations">Hotels</NavLink>
          <NavLink href="/accommodations">B&B's</NavLink>
          <NavLink href="/accommodations">Guesthouses</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>
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
        <div className="develop_author">
          Design & Development by <span>Florent Hajdari.</span> All rights
          reserved!
        </div>
      </div>
    </footer>
  );
}

export default Footer;
