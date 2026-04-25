import { Helmet } from "react-helmet";
import { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import Heading from "../layout/Heading";
import Loader from "../layout/Loader";
import ErrorMessage from "../layout/ErrorMessage";
import ValidationError from "../forms/ValidationError";

import { BASE_URL, ACCOMMODATIONS } from "../../constants/api";
import AuthContext from "../../context/AuthContext";
import bg from "../../images/bg_form.png";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function decodeText(value) {
  if (!value) return "";

  return String(value)
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .trim();
}

function EditHotel() {
  const [accommodation, setAccommodation] = useState(null);
  const [fetchingAccommodation, setFetchingAccommodation] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [updatingAccommodation, setUpdatingAccommodation] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const [auth] = useContext(AuthContext);
  const history = useHistory();
  const { id } = useParams();

  const url = `${BASE_URL}${ACCOMMODATIONS}/${id}`;

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedType = watch("type");
  const selectedStay = watch("stay");
  const selectedCancellation = watch("cancellation");

  const typeOptions = ["Hotel", "B&B", "BnB", "Guesthouse", "Apartment"];

  const stayOptions = [
    "1 night, 2 adults",
    "1 night, max 4 persons",
    "1 night, max 6 persons",
  ];

  const cancellationOptions = [
    "Free cancellation",
    "Free cancellation up to 48 hours before check-in",
  ];

  useEffect(() => {
    if (!auth?.token) {
      history.push("/login");
      return;
    }

    async function getAccommodation() {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const item = response.data;
        const acf = item?.acf || {};

        setAccommodation(item);

        reset({
          title: decodeText(item?.title?.rendered),
          price: acf.price || "",
          type: decodeText(acf.type_of_accommodation || acf.type),
          long_description: acf.long_description || "",
          location: acf.location || "",
          phone: acf.phone || "",
          breakfast: String(acf.breakfast ?? false),
          wifi: String(acf.wifi ?? false),
          stay: decodeText(acf.stay),
          parking: String(acf.parking ?? false),
          star: String(acf.star || ""),
          cancellation: decodeText(acf.cancellation),
          fitness: String(acf.fitness ?? false),
          featured_media: item?.featured_media || "",
          image_2: acf.image_2 || "",
          image_3: acf.image_3 || "",
          latitude: acf.latitude || "",
          longitude: acf.longitude || "",
        });
      } catch (error) {
        console.log("EDIT FETCH ERROR:", error.response?.data || error);
        setFetchError(error.toString());
      } finally {
        setFetchingAccommodation(false);
      }
    }

    getAccommodation();
  }, [auth, history, reset, url]);

  async function uploadImage(file, fieldName) {
    if (!file) return;

    setUploadingImage(fieldName);
    setUpdateError(null);
    setUpdated(false);

    try {
      const response = await axios.post(`${BASE_URL}/media`, file, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Disposition": `attachment; filename="${file.name}"`,
          "Content-Type": file.type,
        },
      });

      const imageId = response.data.id;

      setValue(fieldName, imageId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.log("UPLOAD IMAGE ERROR:", error.response?.data || error);
      setUpdateError("Image upload failed.");
    } finally {
      setUploadingImage(null);
    }
  }

  async function onSubmit(data) {
    setUpdatingAccommodation(true);
    setUpdateError(null);
    setUpdated(false);

    const updatedAccommodation = {
      title: data.title,
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
      const response = await axios.post(url, updatedAccommodation, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });

      setAccommodation(response.data);
      setUpdated(true);
    } catch (error) {
      console.log("EDIT UPDATE ERROR:", error.response?.data || error);
      setUpdateError("Could not update accommodation.");
    } finally {
      setUpdatingAccommodation(false);
    }
  }

  function deleteAccommodation() {
    confirmAlert({
      title: "Delete accommodation",
      message: "Are you sure you want to delete this accommodation?",
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
    setUpdatingAccommodation(true);
    setUpdateError(null);

    try {
      await axios.delete(`${url}?force=true`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      history.push("/admin/dashboard");
    } catch (error) {
      console.log("DELETE ERROR:", error.response?.data || error);
      setUpdateError("Could not delete accommodation.");
    } finally {
      setUpdatingAccommodation(false);
    }
  }

  if (fetchingAccommodation) return <Loader />;

  if (fetchError || !accommodation) {
    return <ErrorMessage message="Error: An error occured!" />;
  }

  return (
    <main>
      <Helmet>
        <title>Edit Page | Holidaze!</title>
        <meta name="description" content="Edit Page | Holidaze!" />
      </Helmet>

      <div
        className="admin edit--admin"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <Container className="hotels--admin edit--page">
          <Heading content="Edit Page" />

          <form onSubmit={handleSubmit(onSubmit)}>
            {updated && (
              <Alert variant="success">The accommodation was updated!</Alert>
            )}

            {updateError && <ValidationError>{updateError}</ValidationError>}

            <fieldset disabled={updatingAccommodation}>
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
                      <ValidationError>{errors.title.message}</ValidationError>
                    )}
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Price"
                      {...register("price")}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Type of accommodation</Form.Label>
                    <Form.Control as="select" {...register("type")}>
                      <option value="">Select type</option>

                      {selectedType && !typeOptions.includes(selectedType) && (
                        <option value={selectedType}>{selectedType}</option>
                      )}

                      {typeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Control>
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
                      <ValidationError>
                        {errors.long_description.message}
                      </ValidationError>
                    )}
                  </Form.Group>
                </Col>

                <Col sm={12} md={6}>
                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      placeholder="Location"
                      {...register("location")}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control placeholder="Phone" {...register("phone")} />
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
                    <Form.Control as="select" {...register("stay")}>
                      <option value="">Select stay</option>

                      {selectedStay && !stayOptions.includes(selectedStay) && (
                        <option value={selectedStay}>{selectedStay}</option>
                      )}

                      {stayOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Star</Form.Label>
                    <Form.Control as="select" {...register("star")}>
                      <option value="">Select star</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Cancellation</Form.Label>
                    <Form.Control as="select" {...register("cancellation")}>
                      <option value="">Select cancellation</option>

                      {selectedCancellation &&
                        !cancellationOptions.includes(selectedCancellation) && (
                          <option value={selectedCancellation}>
                            {selectedCancellation}
                          </option>
                        )}

                      {cancellationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Control>
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
                      {...register("featured_media")}
                      readOnly
                    />
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
                      {...register("image_2")}
                      readOnly
                    />
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
                      {...register("image_3")}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Form.Row>

              <Form.Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      placeholder="Latitude"
                      {...register("latitude")}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group>
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      placeholder="Longitude"
                      {...register("longitude")}
                    />
                  </Form.Group>
                </Col>
              </Form.Row>

              <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <Button variant="info" type="submit" name="update">
                  <i className="fas fa-sync-alt"></i>{" "}
                  {updatingAccommodation ? "Updating..." : "Update"}
                </Button>

                <Button
                  variant="danger"
                  type="button"
                  onClick={deleteAccommodation}
                  disabled={updatingAccommodation}
                  style={{
                    backgroundColor: "#dc3545",
                    borderColor: "#dc3545",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-trash"></i> Delete
                </Button>
              </div>
            </fieldset>
          </form>
        </Container>
      </div>
    </main>
  );
}

export default EditHotel;
