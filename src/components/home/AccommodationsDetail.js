import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Heading from "../layout/Heading";
import Loader from "../layout/Loader";
import ErrorMessage from "../layout/ErrorMessage";
import axios from "axios";
import { BASE_URL, ACCOMMODATIONS } from "../../constants/api";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Star from "./Star";
import Map from "./Map";

export default function AccommodationDetail() {
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  const url = `${BASE_URL}${ACCOMMODATIONS}/${id}?_embed&acf_format=standard`;

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

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} />;
  }

  const featuredImage =
    accommodation?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

  const image2 =
    accommodation?.acf?.image_2_url ||
    accommodation?.acf?.image_2 ||
    featuredImage;

  const image3 =
    accommodation?.acf?.image_3_url ||
    accommodation?.acf?.image_3 ||
    featuredImage;

  const hotelName = accommodation?.title?.rendered || "Accommodation";
  const shortDescription = accommodation?.acf?.short_description || "";
  const longDescription = accommodation?.acf?.long_description || "";
  const location = accommodation?.acf?.location || "";
  const phone = accommodation?.acf?.phone || "";
  const star = accommodation?.acf?.star || 0;
  const breakfast = accommodation?.acf?.breakfast;
  const wifi = accommodation?.acf?.wifi;
  const parking = accommodation?.acf?.parking;
  const fitness = accommodation?.acf?.fitness;
  const cancellation = accommodation?.acf?.cancellation || "";
  const stay = accommodation?.acf?.stay || "";
  const price = accommodation?.acf?.price || "";
  const latitude = parseFloat(accommodation?.acf?.latitude);
  const longitude = parseFloat(accommodation?.acf?.longitude);

  return (
    <>
      <Helmet>
        <title>{hotelName}, Bergen!</title>
        <meta
          name="description"
          content="A great place where you can feel like in your home!"
        />
      </Helmet>

      <main className="detail--page">
        <div className="banner detail--page">
          <Heading content="... where the soul finds peace!" />
          <div className="shadow"></div>

          <Carousel activeIndex={index} onSelect={handleSelect}>
            <Carousel.Item>
              <img
                className="d-flex justify-content-top w-100"
                src={featuredImage}
                alt={hotelName}
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-flex justify-content-top w-100"
                src={image2}
                alt={hotelName}
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-flex justify-content-top w-100"
                src={image3}
                alt={hotelName}
              />
            </Carousel.Item>
          </Carousel>
        </div>

        <Container>
          <div className="details--info">
            <div className="title--detail">
              <h2>{hotelName}</h2>
              <Star stars={star} />
            </div>

            <Card.Text className="location">
              <i className="fas fa-map-marker-alt"></i>
              {location}
              <br />
              <i className="fas fa-phone-alt"></i>
              {phone}
            </Card.Text>

            <Card.Text className="description">
              {longDescription || shortDescription}
            </Card.Text>

            <Row>
              <Col xs={12} md={6}>
                <div className="sticky--detail">
                  <Card.Text className="breakfast">
                    <i className="fas fa-utensils"></i>
                    {breakfast ? "Breakfast included" : "No breakfast"}
                  </Card.Text>

                  <Card.Text className="wifi">
                    <i className="fas fa-wifi"></i>
                    {wifi ? "Free wifi" : "No wifi"}
                  </Card.Text>

                  <Card.Text className="parking">
                    <i className="fas fa-parking"></i>
                    {parking ? "Parking available" : "No parking"}
                  </Card.Text>

                  {fitness && (
                    <Card.Text className="fitness">
                      <i className="fas fa-dumbbell"></i>
                      Fitness available
                    </Card.Text>
                  )}

                  <Card.Text className="cancellation">
                    <i className="fas fa-check"></i>
                    {cancellation}
                  </Card.Text>

                  <Card.Text className="stay">{stay}</Card.Text>

                  <Card.Text className="price">NOK {price}</Card.Text>

                  <Link
                    to={`/accommodation/booking/${accommodation.id}`}
                    className="accommodation--button"
                  >
                    <Button variant="primary">Book Now!</Button>
                  </Link>
                </div>
              </Col>

              <Col xs={12} md={6} className="map">
                {!Number.isNaN(latitude) && !Number.isNaN(longitude) && (
                  <Map lat={latitude} lng={longitude} hotelName={hotelName} />
                )}
              </Col>
            </Row>
          </div>
        </Container>
      </main>
    </>
  );
}
