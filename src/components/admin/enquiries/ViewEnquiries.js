import { useContext, useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";

import Heading from "../../layout/Heading";
import Container from "react-bootstrap/Container";
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

function ViewEnquiries() {
  const [enquiry, setEnquiry] = useState(null);
  const [fetchingEnquiry, setFetchingEnquiry] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [auth] = useContext(AuthContext);
  const history = useHistory();
  const { id } = useParams();

  const url = `${BASE_URL}${ENQUIRIES}/${id}`;

  useEffect(() => {
    if (!auth?.token) {
      history.push("/login");
      return;
    }

    async function getEnquiry() {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        setEnquiry(response.data);
      } catch (error) {
        console.log("VIEW ENQUIRY ERROR:", error.response?.data || error);
        setFetchError(error.toString());
      } finally {
        setFetchingEnquiry(false);
      }
    }

    getEnquiry();
  }, [auth, history, url]);

  if (fetchingEnquiry) return <Loader />;

  if (fetchError || !enquiry) {
    return <ErrorMessage message="Error: An error occured!" />;
  }

  const acf = enquiry.acf || {};

  return (
    <main
      className="admin view--enquiry"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Container className="hotels--admin view--enquiry__page">
        <Heading content="Enquiry details" />

        <Link to="/admin/enquiries">
          <i className="fas fa-arrow-left"></i> Back to enquiries page
        </Link>

        <div className="enquiry--detail">
          <h4>
            <span>{acf.full_name}</span> made the reservation at:
            <br />
            <span>"{acf.accommodation_name}"</span>
          </h4>

          <h6>
            Email: <span>{acf.email}</span>
          </h6>

          <h6>
            Check In: <span>{formatDate(acf.check_in)}</span>
          </h6>

          <h6>
            Check Out: <span>{formatDate(acf.check_out)}</span>
          </h6>

          <h6>
            Sent at: <span>{formatDate(enquiry.date)}</span>
          </h6>
        </div>

        <DeleteEnquiry id={enquiry.id} />
      </Container>
    </main>
  );
}

export default ViewEnquiries;
