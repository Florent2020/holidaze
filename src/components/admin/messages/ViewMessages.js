import { useContext, useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";

import Heading from "../../layout/Heading";
import Container from "react-bootstrap/Container";
import bg from "../../../images/bg_form.png";
import Loader from "../../layout/Loader";
import ErrorMessage from "../../layout/ErrorMessage";
import DeleteMessage from "./DeleteMessage";

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

function ViewMessages() {
  const [message, setMessage] = useState(null);
  const [fetchingMessage, setFetchingMessage] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [auth] = useContext(AuthContext);
  const history = useHistory();
  const { id } = useParams();

  const url = `${BASE_URL}${MESSAGES}/${id}`;

  useEffect(() => {
    if (!auth?.token) {
      history.push("/login");
      return;
    }

    async function getMessage() {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        setMessage(response.data);
      } catch (error) {
        console.log("VIEW MESSAGE ERROR:", error.response?.data || error);
        setFetchError(error.toString());
      } finally {
        setFetchingMessage(false);
      }
    }

    getMessage();
  }, [auth, history, url]);

  if (fetchingMessage) return <Loader />;

  if (fetchError || !message) {
    return <ErrorMessage message="Error: An error occured!" />;
  }

  const acf = message.acf || {};

  return (
    <main
      className="admin view--message"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Container className="hotels--admin view--message__page">
        <Heading content="View Message Page" />

        <Link to="/admin/messages">
          <i className="fas fa-arrow-left"></i> Back to messages
        </Link>

        <div>
          <h3>From: {acf.full_name}</h3>

          <h6>
            <strong>Email:</strong> {acf.email}
          </h6>

          <h6>
            <strong>Subject:</strong> {acf.subject}
          </h6>

          <p>
            <strong>Message:</strong> {acf.message}
          </p>

          <p>
            <strong>Sent:</strong> {formatDate(message.date)}
          </p>
        </div>

        <DeleteMessage id={message.id} />
      </Container>
    </main>
  );
}

export default ViewMessages;
