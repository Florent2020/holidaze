import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import ValidationError from "../forms/ValidationError";
import {
  MINIMUM_FULL_NAME_CHARACTERS,
  MINIMUM_MESSAGE_VALUE,
} from "../../constants/registration";
import { CONTACT_ENDPOINT } from "../../constants/api";

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
    .required("Please enter your email address!")
    .email("Please enter a valid email address!"),
  subject: yup.string().required("Please enter a subject!"),
  message: yup
    .string()
    .required("Please enter your message!")
    .min(
      MINIMUM_MESSAGE_VALUE,
      `The message must be at least ${MINIMUM_MESSAGE_VALUE} characters!`,
    ),
});

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    setSubmitting(true);
    setSubmitted(false);
    setServerError(null);

    try {
      await axios.post(CONTACT_ENDPOINT, {
        full_name: data.full_name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      setSubmitted(true);
      reset();
    } catch (error) {
      console.log("CONTACT FORM ERROR:", error.response?.data || error);
      setServerError(
        error.response?.data?.message || "Error: An error occured!",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container>
      {submitted && (
        <Alert variant="success">Your message was successful!</Alert>
      )}

      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={submitting}>
          <Form.Group>
            <Form.Control placeholder="Full Name" {...register("full_name")} />
            {errors.full_name && (
              <ValidationError>{errors.full_name.message}</ValidationError>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Control placeholder="Email" {...register("email")} />
            {errors.email && (
              <ValidationError>{errors.email.message}</ValidationError>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Control placeholder="Subject" {...register("subject")} />
            {errors.subject && (
              <ValidationError>{errors.subject.message}</ValidationError>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Control
              placeholder="Message"
              {...register("message")}
              as="textarea"
              rows={6}
            />
            {errors.message && (
              <ValidationError>{errors.message.message}</ValidationError>
            )}
          </Form.Group>

          <Button variant="info" type="submit">
            {submitting ? "Sending..." : "Send"}
          </Button>
        </fieldset>
      </Form>
    </Container>
  );
}

export default ContactForm;
