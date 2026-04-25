import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

import Heading from "../layout/Heading";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import ValidationForm from "../forms/ValidationError";
import AuthContext from "../../context/AuthContext";
import { BASE_URL, ACCOMMODATIONS } from "../../constants/api";
import bg from "../../images/bg_form.png";

function AddAccommodation() {
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [created, setCreated] = useState(false);

  const history = useHistory();
  const [auth] = useContext(AuthContext);

  const url = `${BASE_URL}${ACCOMMODATIONS}`;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      price: "",
      type: "",
      long_description: "",
      location: "",
      phone: "",
      breakfast: "false",
      wifi: "false",
      stay: "",
      parking: "false",
      star: "",
      cancellation: "",
      fitness: "false",
      featured_media: "",
      image_2: "",
      image_3: "",
      latitude: "",
      longitude: "",
    },
  });

  if (!auth?.token) {
    history.push("/login");
  }

  async function uploadImage(file, fieldName) {
    if (!file) return;

    setUploadingImage(fieldName);
    setServerError(null);

    try {
      const response = await axios.post(`${BASE_URL}/media`, file, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Disposition": `attachment; filename="${file.name}"`,
          "Content-Type": file.type,
        },
      });

      setValue(fieldName, response.data.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.log("UPLOAD IMAGE ERROR:", error.response?.data || error);
      setServerError("Image upload failed.");
    } finally {
      setUploadingImage(null);
    }
  }

  async function onSubmit(data) {
    setSubmitting(true);
    setServerError(null);
    setCreated(false);

    const newAccommodation = {
      title: data.title,
      status: "publish",
      featured_media: data.featured_media ? Number(data.featured_media) : 0,
      acf: {
        price: data.price,
        type: data.type,
        type_of_accommodation: data.type,
        long_description: data.long_description,
        location: data.location,
        phone: data.phone,
        breakfast: data.breakfast === "true",
        wifi: data.wifi === "true",
        stay: data.stay,
        parking: data.parking === "true",
        star: data.star,
        cancellation: data.cancellation,
        fitness: data.fitness === "true",
        image_2: data.image_2 ? Number(data.image_2) : "",
        image_3: data.image_3 ? Number(data.image_3) : "",
        latitude: data.latitude,
        longitude: data.longitude,
      },
    };

    try {
      const response = await axios.post(url, newAccommodation, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("ACCOMMODATION CREATED:", response.data);
      setCreated(true);

      setTimeout(() => {
        history.push("/admin/dashboard");
      }, 1000);
    } catch (error) {
      console.log("ADD ACCOMMODATION ERROR:", error.response?.data || error);
      setServerError(
        error.response?.data?.message || "Could not create accommodation.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <Helmet>
        <title>Add Page | Holidaze!</title>
        <meta name="description" content="Add Page | Holidaze!" />
      </Helmet>

      <div
        className="admin add--admin"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <Container className="hotels--admin add--page">
          <Heading content="Add page" />

          <form onSubmit={handleSubmit(onSubmit)}>
            {created && (
              <Alert variant="success">Accommodation was created!</Alert>
            )}

            {serverError && <ValidationForm>{serverError}</ValidationForm>}

            <fieldset disabled={submitting}>
              <Form.Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Hotel</Form.Label>
                    <Form.Control
                      placeholder="Hotel name"
                      {...register("title", {
                        required: "Hotel name is required",
                      })}
                    />
                    {errors.title && (
                      <ValidationForm>{errors.title.message}</ValidationForm>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Price"
                      {...register("price", {
                        required: "Price is required",
                      })}
                    />
                    {errors.price && (
                      <ValidationForm>{errors.price.message}</ValidationForm>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Type of accommodation</Form.Label>
                    <Form.Control
                      as="select"
                      {...register("type", {
                        required: "Type is required",
                      })}
                    >
                      <option value="">Select type</option>
                      <option value="Hotel">Hotel</option>
                      <option value="B&B">B&B</option>
                      <option value="BnB">BnB</option>
                      <option value="Guesthouse">Guesthouse</option>
                      <option value="Apartment">Apartment</option>
                    </Form.Control>
                    {errors.type && (
                      <ValidationForm>{errors.type.message}</ValidationForm>
                    )}
                  </Form.Group>
                </Col>
              </Form.Row>

              <Form.Row>
                <Col sm={12} md={6}>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      placeholder="Description"
                      as="textarea"
                      rows={8}
                      {...register("long_description", {
                        required: "Description is required",
                      })}
                    />
                    {errors.long_description && (
                      <ValidationForm>
                        {errors.long_description.message}
                      </ValidationForm>
                    )}
                  </Form.Group>
                </Col>

                <Col sm={12} md={6}>
                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      placeholder="Location"
                      {...register("location", {
                        required: "Location is required",
                      })}
                    />
                    {errors.location && (
                      <ValidationForm>{errors.location.message}</ValidationForm>
                    )}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      placeholder="Phone"
                      {...register("phone", {
                        required: "Phone is required",
                      })}
                    />
                    {errors.phone && (
                      <ValidationForm>{errors.phone.message}</ValidationForm>
                    )}
                  </Form.Group>
                </Col>
              </Form.Row>

              <Form.Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Breakfast</Form.Label>
                    <Form.Control as="select" {...register("breakfast")}>
                      <option value="false">No breakfast</option>
                      <option value="true">Breakfast included</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Wifi</Form.Label>
                    <Form.Control as="select" {...register("wifi")}>
                      <option value="false">No wifi</option>
                      <option value="true">Wifi</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Parking</Form.Label>
                    <Form.Control as="select" {...register("parking")}>
                      <option value="false">No parking</option>
                      <option value="true">Parking</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Fitness</Form.Label>
                    <Form.Control as="select" {...register("fitness")}>
                      <option value="false">No fitness</option>
                      <option value="true">Fitness Center</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Form.Row>

              <Form.Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Stay</Form.Label>
                    <Form.Control
                      as="select"
                      {...register("stay", {
                        required: "Stay is required",
                      })}
                    >
                      <option value="">Select stay</option>
                      <option value="1 night, 2 adults">
                        1 night, 2 adults
                      </option>
                      <option value="1 night, max 4 persons">
                        1 night, max 4 persons
                      </option>
                      <option value="1 night, max 6 persons">
                        1 night, max 6 persons
                      </option>
                    </Form.Control>
                    {errors.stay && (
                      <ValidationForm>{errors.stay.message}</ValidationForm>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Star</Form.Label>
                    <Form.Control
                      as="select"
                      {...register("star", {
                        required: "Star is required",
                      })}
                    >
                      <option value="">Select star</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Form.Control>
                    {errors.star && (
                      <ValidationForm>{errors.star.message}</ValidationForm>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Cancellation</Form.Label>
                    <Form.Control
                      as="select"
                      {...register("cancellation", {
                        required: "Cancellation is required",
                      })}
                    >
                      <option value="">Select cancellation</option>
                      <option value="Free cancellation">
                        Free cancellation
                      </option>
                      <option value="Free cancellation up to 48 hours before check-in">
                        Free cancellation up to 48 hours before check-in
                      </option>
                    </Form.Control>
                    {errors.cancellation && (
                      <ValidationForm>
                        {errors.cancellation.message}
                      </ValidationForm>
                    )}
                  </Form.Group>
                </Col>
              </Form.Row>

              <Form.Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Featured Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadImage(e.target.files[0], "featured_media")
                      }
                    />
                    <Form.Text>
                      {uploadingImage === "featured_media"
                        ? "Uploading image..."
                        : `Current featured image ID: ${
                            getValues("featured_media") || "None"
                          }`}
                    </Form.Text>
                    <Form.Control
                      type="number"
                      placeholder="Featured image ID"
                      {...register("featured_media", {
                        required: "Featured image is required",
                      })}
                      readOnly
                    />
                    {errors.featured_media && (
                      <ValidationForm>
                        {errors.featured_media.message}
                      </ValidationForm>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Image 2</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadImage(e.target.files[0], "image_2")
                      }
                    />
                    <Form.Text>
                      {uploadingImage === "image_2"
                        ? "Uploading image..."
                        : `Current image 2 ID: ${
                            getValues("image_2") || "None"
                          }`}
                    </Form.Text>
                    <Form.Control
                      type="number"
                      placeholder="Image 2 ID"
                      {...register("image_2", {
                        required: "Image 2 is required",
                      })}
                      readOnly
                    />
                    {errors.image_2 && (
                      <ValidationForm>{errors.image_2.message}</ValidationForm>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Image 3</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadImage(e.target.files[0], "image_3")
                      }
                    />
                    <Form.Text>
                      {uploadingImage === "image_3"
                        ? "Uploading image..."
                        : `Current image 3 ID: ${
                            getValues("image_3") || "None"
                          }`}
                    </Form.Text>
                    <Form.Control
                      type="number"
                      placeholder="Image 3 ID"
                      {...register("image_3", {
                        required: "Image 3 is required",
                      })}
                      readOnly
                    />
                    {errors.image_3 && (
                      <ValidationForm>{errors.image_3.message}</ValidationForm>
                    )}
                  </Form.Group>
                </Col>
              </Form.Row>

              <Form.Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      placeholder="Ex. 60.3913"
                      {...register("latitude", {
                        required: "Latitude is required",
                      })}
                    />
                    {errors.latitude && (
                      <ValidationForm>{errors.latitude.message}</ValidationForm>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      placeholder="Ex. 5.3221"
                      {...register("longitude", {
                        required: "Longitude is required",
                      })}
                    />
                    {errors.longitude && (
                      <ValidationForm>
                        {errors.longitude.message}
                      </ValidationForm>
                    )}
                  </Form.Group>
                </Col>
              </Form.Row>

              <Button variant="info" type="submit">
                <i className="fas fa-plus-square"></i>{" "}
                {submitting ? "Adding..." : "Add"}
              </Button>
            </fieldset>
          </form>
        </Container>
      </div>
    </main>
  );
}

export default AddAccommodation;
