import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import AuthContext from "../../../context/AuthContext";
import { BASE_URL, MESSAGES } from "../../../constants/api";

export default function DeleteMessage({ id }) {
  const [error, setError] = useState(null);

  const [auth] = useContext(AuthContext);
  const history = useHistory();

  const url = `${BASE_URL}${MESSAGES}/${id}?force=true`;

  function deleteMessage() {
    confirmAlert({
      title: "Delete message",
      message: "Are you sure you want to delete this message?",
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

      history.push("/admin/messages");
      window.location.reload();
    } catch (error) {
      console.log("DELETE MESSAGE ERROR:", error.response?.data || error);
      setError(error);
    }
  }

  return (
    <Button
      variant="danger"
      type="button"
      name="delete message"
      className="delete--message"
      onClick={deleteMessage}
    >
      <i className="fas fa-trash"></i> {error ? "Error" : "Delete"}
    </Button>
  );
}

DeleteMessage.propTypes = {
  id: PropTypes.number.isRequired,
};
