import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import Heading from "../layout/Heading";
import BookingForm from "./BookingForm";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import bg from "../../images/bg_form.png";
import { Card } from "react-bootstrap";
import axios from "axios";
import { BASE_URL, ACCOMMODATIONS } from "../../constants/api";
import ErrorMessage from "../layout/ErrorMessage";
import Loader from "../layout/Loader";

function Booking() {
  const { id } = useParams();

  const url = `${BASE_URL}${ACCOMMODATIONS}/${id}?acf_format=standard&_embed`;

  const emptyInit = {};
  const [accommodation, setAccommodation] = useState(emptyInit);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getDetail() {
      try {
        const response = await axios.get(url);
        setAccommodation(response.data);
      } catch (error) {
        console.log(error);
        setError(error.toString());
      } finally {
        setLoading(false);
      }
    }

    getDetail();
  }, [url]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} />;
  }

  const accommodationName = accommodation?.title?.rendered || "Accommodation";

  return (
    <>
      <Helmet>
        <title>Book now at {accommodationName}, Bergen | Holidaze!</title>
        <meta
          name="description"
          content="Easy Way to Book Accommodations Online at Holidaze!"
        />
      </Helmet>

      <main className="booking" style={{ backgroundImage: `url(${bg})` }}>
        <Container className="booking__bg">
          <Row>
            <Col xs={12} md={5} className="booking__bg--left">
              <h2>
                Book now at <span>"{accommodationName}"</span>
              </h2>
              <Card.Text>
                Please fill out the form to book your accommodation!
              </Card.Text>
            </Col>

            <Col xs={12} md={7} className="booking__bg--right">
              <div className="booking__logo">
                <Heading content="Booking page" />
              </div>
              <BookingForm accName={accommodationName} />
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}

export default Booking;
