import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Loader from "../layout/Loader";
import ErrorMessage from "../layout/ErrorMessage";
import Heading from "../layout/Heading";
import SearchBox from "../search/SearchBox";

import { BASE_URL, ACCOMMODATIONS } from "../../constants/api";
import AuthContext from "../../context/AuthContext";

import bg from "../../images/bg_form.png";

function AdminAccommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [mediaMap, setMediaMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchField, setSearchField] = useState("");

  const [auth] = useContext(AuthContext);
  const history = useHistory();

  const url = `${BASE_URL}${ACCOMMODATIONS}?per_page=100`;

  useEffect(() => {
    if (!auth?.token) {
      history.push("/login");
      return;
    }

    async function getAccommodations() {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const data = response.data;
        setAccommodations(data);

        const imageIds = data
          .map(
            (item) =>
              item?.acf?.image_2 || item?.acf?.image_1 || item?.acf?.image_3,
          )
          .filter(Boolean);

        const uniqueImageIds = [...new Set(imageIds)];

        const mediaResponses = await Promise.all(
          uniqueImageIds.map((id) => axios.get(`${BASE_URL}/media/${id}`)),
        );

        const newMediaMap = {};

        mediaResponses.forEach((mediaResponse) => {
          const media = mediaResponse.data;
          newMediaMap[media.id] = media.source_url;
        });

        setMediaMap(newMediaMap);
      } catch (error) {
        console.log(
          "ADMIN ACCOMMODATIONS ERROR:",
          error.response?.data || error,
        );
        setError(error.toString());
      } finally {
        setLoading(false);
      }
    }

    getAccommodations();
  }, [auth, history, url]);

  function getAccommodationName(accommodation) {
    return accommodation?.title?.rendered || "No title";
  }

  function getAccommodationImage(accommodation) {
    const imageId =
      accommodation?.acf?.image_2 ||
      accommodation?.acf?.image_1 ||
      accommodation?.acf?.image_3;

    return mediaMap[imageId] || "";
  }

  const filteredAccommodation = accommodations.filter((item) =>
    getAccommodationName(item)
      .toLowerCase()
      .includes(searchField.toLowerCase()),
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message="Error: An error occured!" />;
  }

  return (
    <main>
      <Helmet>
        <title>Dashboard Page | Holidaze!</title>
        <meta name="description" content="Dashboard Page | Holidaze!" />
      </Helmet>

      <div className="admin" style={{ backgroundImage: `url(${bg})` }}>
        <Container className="hotels--admin dashboard">
          <div className="accommodations--body">
            <Heading content="Accommodations" />

            <SearchBox
              placeholder="Search accommodation..."
              handleChange={(e) => setSearchField(e.target.value)}
            />

            <Row>
              {filteredAccommodation.map((accommodation) => {
                const title = getAccommodationName(accommodation);
                const image = getAccommodationImage(accommodation);

                return (
                  <Col sm={12} md={6} lg={3} key={accommodation.id}>
                    <Card className="dark--card">
                      {image && (
                        <Card.Img
                          variant="top"
                          src={image}
                          className="admin--images"
                          alt={title.replace(/<[^>]+>/g, "")}
                        />
                      )}

                      <Card.Body>
                        <Card.Title>
                          <h5
                            dangerouslySetInnerHTML={{
                              __html: title,
                            }}
                          />
                        </Card.Title>

                        <Link
                          to={`/admin/accommodation/edit/${accommodation.id}`}
                          className="accommodation--button"
                        >
                          <Button variant="primary" className="edit">
                            <i className="fas fa-edit"></i> Edit
                          </Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Container>
      </div>
    </main>
  );
}

export default AdminAccommodations;
