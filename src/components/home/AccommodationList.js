import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Star from "./Star";

function AccommodationList(props) {
  const getFeaturedImage = (accommodation) => {
    return (
      accommodation?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""
    );
  };

  return (
    <>
      <div className="pages">
        {props.accommodationsData.map((accommodation) => {
          const imageUrl = getFeaturedImage(accommodation);

          return (
            <div className="col-lg-4 col-md-6 col-12" key={accommodation.id}>
              <Card className="dark--card">
                <Card.Text className="type">
                  {accommodation.acf?.type || "accommodation"}
                </Card.Text>

                <Card.Text className="trips">
                  <i
                    className={
                      localStorage.getItem("accommodation") === null
                        ? "far fa-heart"
                        : JSON.parse(
                              localStorage.getItem("accommodation"),
                            ).filter((x) => x.id === accommodation.id)
                              .length === 0
                          ? "far fa-heart"
                          : "fas fa-heart"
                    }
                    value="addTrips"
                    onClick={(e) => props.favoriteTrips(e, accommodation)}
                  ></i>
                </Card.Text>

                <Card.Img variant="top" src={imageUrl} />

                <Card.Title>
                  <h5
                    dangerouslySetInnerHTML={{
                      __html: accommodation.title?.rendered,
                    }}
                  />
                </Card.Title>

                <Card.Text className="location">
                  <i className="fas fa-map-marker-alt"></i>
                  {accommodation.acf?.location}
                </Card.Text>

                <Star stars={accommodation.acf?.star} />

                <Card.Text className="stay">
                  {accommodation.acf?.stay}
                </Card.Text>

                <Card.Text className="price">
                  NOK {accommodation.acf?.price}
                </Card.Text>

                <Link
                  to={`/accommodation/detail/${accommodation.id}`}
                  className="accommodation--button"
                >
                  <Button variant="primary">View More!</Button>
                </Link>

                {/* ❌ REMOVE BUTTON vetëm në Trips page */}
                {props.removeFavouriteAccommodation && (
                  <Button
                    variant="dark"
                    className="remove"
                    onClick={() =>
                      props.removeFavouriteAccommodation(accommodation)
                    }
                  >
                    <i className="fas fa-trash"></i> Remove
                  </Button>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default AccommodationList;
