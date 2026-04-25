import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import Heading from "../../layout/Heading";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "../../layout/Loader";
import ErrorMessage from "../../layout/ErrorMessage";
import bg from "../../../images/bg_form.png";

import AuthContext from "../../../context/AuthContext";
import { BASE_URL, MESSAGES } from "../../../constants/api";

function formatDate(dateValue) {
  if (!dateValue) return "No date";

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
}

function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [auth] = useContext(AuthContext);
  const history = useHistory();

  const url = `${BASE_URL}${MESSAGES}?per_page=100`;

  useEffect(() => {
    if (!auth?.token) {
      history.push("/login");
      return;
    }

    async function getMessages() {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        setMessages(response.data);
      } catch (error) {
        console.log("MESSAGES ERROR:", error.response?.data || error);
        setError(error.toString());
      } finally {
        setLoading(false);
      }
    }

    getMessages();
  }, [auth, history, url]);

  if (loading) return <Loader />;

  if (error) return <ErrorMessage message="Error: An error occured!" />;

  return (
    <main>
      <Helmet>
        <title>Messages Page | Holidaze!</title>
        <meta name="description" content="Messages Page | Holidaze!" />
      </Helmet>

      <div
        className="admin messages--admin"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <Container className="hotels--admin messages--page">
          <Heading content="Messages Page" />

          {messages.length === 0 && (
            <p className="empty--message">No message yet!</p>
          )}

          <Row>
            {messages.map((message) => {
              const acf = message.acf || {};

              return (
                <div className="messages--width" key={message.id}>
                  <div className="messages--table">
                    <Link
                      to={`/admin/viewMessages/${message.id}`}
                      className="message--link"
                    >
                      <Col sm={10} md={10}>
                        <h5>{acf.full_name || message.title?.rendered}</h5>
                        <p>{acf.subject}</p>
                      </Col>

                      <Col sm={2} md={2}>
                        <p>{formatDate(message.date)}</p>
                      </Col>
                    </Link>
                  </div>
                </div>
              );
            })}
          </Row>
        </Container>
      </div>
    </main>
  );
}

export default MessagesAdmin;
