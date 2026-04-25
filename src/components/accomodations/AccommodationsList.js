// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import Card from "react-bootstrap/Card";
// import Row from "react-bootstrap/Row";
// import Button from "react-bootstrap/Button";
// import Star from "../home/Star";

// function AccommodationList(props) {
//   const savedAccommodation =
//     JSON.parse(localStorage.getItem("accommodation")) || [];

//   const [favourites, setFavourites] = useState(savedAccommodation);

//   const saveToLocalStorage = (items) => {
//     localStorage.setItem("accommodation", JSON.stringify(items));
//   };

//   const favoriteTrips = (e, trip) => {
//     if (e.currentTarget.classList.contains("fas")) {
//       e.currentTarget.classList.remove("fas");
//       e.currentTarget.classList.add("far");
//     } else {
//       e.currentTarget.classList.remove("far");
//       e.currentTarget.classList.add("fas");
//     }

//     const exists = favourites.some((favourite) => favourite.id === trip.id);

//     if (exists) {
//       const filtered = favourites.filter((item) => item.id !== trip.id);
//       setFavourites(filtered);
//       saveToLocalStorage(filtered);
//     } else {
//       const newFavouriteList = [...favourites, trip];
//       setFavourites(newFavouriteList);
//       saveToLocalStorage(newFavouriteList);
//     }

//     const updatedStorage =
//       JSON.parse(localStorage.getItem("accommodation")) || [];
//     const favoriteCounter = updatedStorage.length;

//     const counterElement = document.getElementById("favorite-counter");
//     if (counterElement) {
//       counterElement.innerText = favoriteCounter === 0 ? "" : favoriteCounter;
//     }
//   };

//   const getFeaturedImage = (accommodation) => {
//     return (
//       accommodation?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""
//     );
//   };

//   return (
//     <Row>
//       <div className="pages">
//         {props.filteredAccommodation.map((accommodation) => {
//           const imageUrl = getFeaturedImage(accommodation);

//           return (
//             <div key={accommodation.id} className="accommodation--box">
//               <Card className="dark--card">
//                 <div className="col-md-5 col-12">
//                   <Card.Text className="type">
//                     {accommodation.acf?.type}
//                   </Card.Text>

//                   <Card.Text className="trips">
//                     <i
//                       className={
//                         localStorage.getItem("accommodation") === null
//                           ? "far fa-heart"
//                           : JSON.parse(
//                                 localStorage.getItem("accommodation"),
//                               ).filter((x) => x.id === accommodation.id)
//                                 .length === 0
//                             ? "far fa-heart"
//                             : "fas fa-heart"
//                       }
//                       value="addTrips"
//                       onClick={(e) => favoriteTrips(e, accommodation)}
//                     ></i>
//                   </Card.Text>

//                   <Card.Img variant="top" src={imageUrl} />
//                 </div>

//                 <div className="col-md-7 col-12">
//                   <Card.Title>
//                     <div className="title--detail">
//                       <h3>{accommodation.title?.rendered}</h3>
//                       <Star stars={accommodation.acf?.star} />
//                     </div>
//                   </Card.Title>

//                   <Card.Text className="location">
//                     <i className="fas fa-map-marker-alt"></i>
//                     {accommodation.acf?.location}
//                   </Card.Text>

//                   <Card.Text className="description">
//                     {accommodation.acf?.short_description}
//                   </Card.Text>

//                   <Card.Text className="stay">
//                     {accommodation.acf?.stay}
//                   </Card.Text>

//                   <Card.Text className="price">
//                     NOK {accommodation.acf?.price}
//                   </Card.Text>

//                   <Link
//                     to={`/accommodation/detail/${accommodation.id}`}
//                     className="accommodation--button"
//                   >
//                     <Button variant="primary">View More!</Button>
//                   </Link>

//                   {props.removeFavouriteAccommodation && (
//                     <Button
//                       variant="dark"
//                       className="remove"
//                       onClick={() =>
//                         props.removeFavouriteAccommodation(accommodation)
//                       }
//                     >
//                       <i className="fas fa-trash"></i>
//                       Remove
//                     </Button>
//                   )}
//                 </div>
//               </Card>
//             </div>
//           );
//         })}
//       </div>
//     </Row>
//   );
// }

// export default AccommodationList;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Star from "../home/Star";

function AccommodationList(props) {
  const savedAccommodation =
    JSON.parse(localStorage.getItem("accommodation")) || [];

  const [favourites, setFavourites] = useState(savedAccommodation);

  const saveToLocalStorage = (items) => {
    localStorage.setItem("accommodation", JSON.stringify(items));
  };

  const favoriteTrips = (e, trip) => {
    if (e.currentTarget.classList.contains("fas")) {
      e.currentTarget.classList.remove("fas");
      e.currentTarget.classList.add("far");
    } else {
      e.currentTarget.classList.remove("far");
      e.currentTarget.classList.add("fas");
    }

    const exists = favourites.some((fav) => fav.id === trip.id);

    if (exists) {
      const filtered = favourites.filter((item) => item.id !== trip.id);
      setFavourites(filtered);
      saveToLocalStorage(filtered);
      window.dispatchEvent(new Event("favoritesUpdated"));
    } else {
      const newFavouriteList = [...favourites, trip];
      setFavourites(newFavouriteList);
      saveToLocalStorage(newFavouriteList);
      window.dispatchEvent(new Event("favoritesUpdated"));
    }

    // update counter
    const updatedStorage =
      JSON.parse(localStorage.getItem("accommodation")) || [];
    const favoriteCounter = updatedStorage.length;

    const counterElement = document.getElementById("favorite-counter");
    if (counterElement) {
      counterElement.innerText = favoriteCounter === 0 ? "" : favoriteCounter;
    }
  };

  // ✅ FIX për WP featured image
  const getFeaturedImage = (accommodation) => {
    return (
      accommodation?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "https://via.placeholder.com/400x300?text=No+Image"
    );
  };

  return (
    <Row>
      <div className="pages">
        {props.accommodationsData?.map((accommodation) => {
          const imageUrl = getFeaturedImage(accommodation);

          return (
            <div key={accommodation.id} className="accommodation-box">
              <Card className="dark--card">
                <div className="col-md-5 col-12">
                  <Card.Text className="type">
                    {accommodation.acf?.type}
                  </Card.Text>

                  {/* ❤️ FAVORITE */}
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
                      onClick={(e) => favoriteTrips(e, accommodation)}
                    ></i>
                  </Card.Text>

                  <Card.Img variant="top" src={imageUrl} />
                </div>

                <div className="col-md-7 col-12">
                  <Card.Title>
                    <div className="title--detail">
                      <h3
                        dangerouslySetInnerHTML={{
                          __html: accommodation.title?.rendered,
                        }}
                      />
                      <Star stars={accommodation.acf?.star} />
                    </div>
                  </Card.Title>

                  <Card.Text className="location">
                    <i className="fas fa-map-marker-alt"></i>{" "}
                    {accommodation.acf?.location}
                  </Card.Text>

                  <Card.Text className="description">
                    {accommodation.acf?.short_description}
                  </Card.Text>

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
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </Row>
  );
}

export default AccommodationList;
