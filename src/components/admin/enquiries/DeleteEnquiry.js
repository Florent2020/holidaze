import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import AuthContext from "../../../context/AuthContext";
import { BASE_URL, ENQUIRIES } from "../../../constants/api";

export default function DeleteEnquiry({ id }) {
  const [error, setError] = useState(null);

  const [auth] = useContext(AuthContext);
  const history = useHistory();

  const url = `${BASE_URL}${ENQUIRIES}/${id}?force=true`;

  function deleteEnquiry() {
    confirmAlert({
      title: "Delete enquiry",
      message: "Are you sure you want to delete this enquiry?",
      buttons: [
        {
          label: "Yes, delete",
          onClick: () => handleDelete(),
        },
        {
          label: "Cancel",
        },
      ],
    });
  }

  async function handleDelete() {
    try {
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      history.push("/admin/enquiries");
      window.location.reload();
    } catch (error) {
      console.log("DELETE ENQUIRY ERROR:", error.response?.data || error);
      setError(error);
    }
  }

  return (
    <Button
      variant="danger"
      type="button"
      name="delete enquiry"
      className="delete--enquiry"
      onClick={deleteEnquiry}
    >
      <i className="fas fa-trash"></i> {error ? "Error" : "Delete"}
    </Button>
  );
}

DeleteEnquiry.propTypes = {
  id: PropTypes.number.isRequired,
};
