import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ValidationError from "../forms/ValidationError";
import { MINIMUM_FULL_NAME_CHARACTERS } from "../../constants/registration";
import axios from "axios";

const schema = yup.object().shape({
  full_name: yup
    .string()
    .required("Please enter your full name!")
    .min(
      MINIMUM_FULL_NAME_CHARACTERS,
      `Your first name must be at least ${MINIMUM_FULL_NAME_CHARACTERS} characters!`,
    ),
  email: yup
    .string()
    .required("Please enter an email address!")
    .email("Please enter a valid email address!"),
  checkIn: yup.string().required("Date is required!"),
  checkOut: yup.string().required("Date is required!"),
});

function BookingForm({ accName }) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const url = "https://florent-hajdari.com/store/wp-json/holidaze/v1/enquiry";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  async function onSubmit(data) {
    const bookingData = {
      full_name: data.full_name,
      email: data.email,
      check_in: data.checkIn,
      check_out: data.checkOut,
      accommodation_name: accName,
    };

    setSubmitting(true);
    setServerError(null);

    try {
      const response = await axios.post(url, bookingData);
      console.log("WP enquiry response:", response.data);

      setToast({
        show: true,
        type: "success",
        message: `Your booking for "${accName}" was sent successfully!`,
      });

      setTimeout(() => {
        setToast({
          show: false,
          type: "",
          message: "",
        });

        reset();
      }, 4000);
    } catch (error) {
      console.log("WP enquiry error:", error);
      setServerError(error.toString());

      setToast({
        show: true,
        type: "error",
        message: "Something went wrong. Please try again.",
      });

      setTimeout(() => {
        setToast({
          show: false,
          type: "",
          message: "",
        });
      }, 4000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Control
            type="text"
            hidden
            id="AccomodationName"
            placeholder="AccomodationName"
            {...register("AccomodationName")}
            value={accName}
            readOnly
          />
        </Form.Group>

        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Full Name"
            {...register("full_name")}
          />
          {errors.full_name && (
            <ValidationError>{errors.full_name.message}</ValidationError>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <ValidationError>{errors.email.message}</ValidationError>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Control
            placeholder="Check In"
            {...register("checkIn")}
            type="date"
          />
          {errors.checkIn && (
            <ValidationError>{errors.checkIn.message}</ValidationError>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Control
            placeholder="Check Out"
            {...register("checkOut")}
            type="date"
          />
          {errors.checkOut && (
            <ValidationError>{errors.checkOut.message}</ValidationError>
          )}
        </Form.Group>

        <Form.Group>
          <Button variant="info" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Submit"}
          </Button>

          <Button variant="dark" type="reset" className="reset">
            Reset
          </Button>
        </Form.Group>
      </Form>

      {serverError && <ValidationError>{serverError}</ValidationError>}

      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>{toast.message}</div>
      )}
    </Container>
  );
}

export default BookingForm;
