import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import ValidationError from "../forms/ValidationError";
import { TOKEN_PATH } from "../../constants/api";
import AuthContext from "../../context/AuthContext";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const schema = yup.object().shape({
  username: yup.string().required("Please enter your username or email!"),
  password: yup.string().required("Please enter your password!"),
});

export default function LoginForm() {
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const history = useHistory();
  const [, setAuth] = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    setSubmitting(true);
    setLoginError(null);

    try {
      const response = await axios.post(TOKEN_PATH, {
        username: data.username,
        password: data.password,
      });

      setAuth({
        token: response.data.token,
        user_email: response.data.user_email,
        user_nicename: response.data.user_nicename,
        user_display_name: response.data.user_display_name,
      });

      history.push("/admin/dashboard");
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);
      setLoginError("Username or Password is wrong!!!");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {loginError && (
        <Alert variant="danger" className="login--alert">
          {loginError}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={submitting}>
          <Form.Group>
            <Form.Control
              name="username"
              placeholder="Username or email"
              {...register("username")}
            />
            {errors?.username && (
              <ValidationError>{errors.username.message}</ValidationError>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Control
              name="password"
              placeholder="Password"
              type="password"
              {...register("password")}
            />
            {errors?.password && (
              <ValidationError>{errors.password.message}</ValidationError>
            )}
          </Form.Group>

          <Button variant="info" type="submit">
            {submitting ? "Logging..." : "Login"}
          </Button>
        </fieldset>
      </Form>
    </div>
  );
}
