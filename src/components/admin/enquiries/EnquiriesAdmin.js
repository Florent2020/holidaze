import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import Heading from "../../layout/Heading";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";

import bg from "../../../images/bg_form.png";
import DeleteEnquiry from "./DeleteEnquiry";
import Loader from "../../layout/Loader";
import ErrorMessage from "../../layout/ErrorMessage";
import AuthContext from "../../../context/AuthContext";
import { BASE_URL, ENQUIRIES } from "../../../constants/api";

function formatDate(dateValue) {
  if (!dateValue) return "No date";

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
}

function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [auth] = useContext(AuthContext);
  const history = useHistory();

  const url = `${BASE_URL}${ENQUIRIES}?per_page=100`;

  useEffect(() => {
    if (!auth?.token) {
      history.push("/login");
      return;
    }

    async function getEnquiries() {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        setEnquiries(response.data);
      } catch (error) {
        console.log("ENQUIRIES ERROR:", error.response?.data || error);
        setError(error.toString());
      } finally {
        setLoading(false);
      }
    }

    getEnquiries();
  }, [auth, history, url]);

  if (loading) return <Loader />;

  if (error) return <ErrorMessage message="Error: An error occured!" />;

  return (
    <main>
      <Helmet>
        <title>Enquiries Page | Holidaze!</title>
        <meta name="description" content="Enquiries Page | Holidaze!" />
      </Helmet>

      <div
        className="admin enquiries--admin"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <Container className="hotels--admin enquiries--page">
          <Heading content="Enquiries Page" />

          {enquiries.length === 0 && (
            <p className="empty--enquiries">No enquiry yet!</p>
          )}

          <Row>
            {enquiries.map((enquiry) => {
              const acf = enquiry.acf || {};

              return (
                <Col
                  sm={12}
                  md={6}
                  lg={4}
                  key={enquiry.id}
                  className="enqyery--id"
                >
                  <Col sm={12} md={5} className="enquirie--table">
                    <p className="sent">Sent: {formatDate(enquiry.date)}</p>
                    <h5>From: {acf.full_name}</h5>
                    <p className="email">Email: {acf.email}</p>
                    <p>Accommodation: {acf.accommodation_name}</p>
                    <p>Check In: {formatDate(acf.check_in)}</p>
                    <p>Check Out: {formatDate(acf.check_out)}</p>

                    <FormGroup className="enquiries--buttons">
                      <Link
                        to={`/admin/viewEnquiries/${enquiry.id}`}
                        className="enquirie--link"
                      >
                        <i className="fas fa-info-circle"></i> View details
                      </Link>

                      <DeleteEnquiry id={enquiry.id} />
                    </FormGroup>
                  </Col>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </main>
  );
}

export default EnquiriesAdmin;
