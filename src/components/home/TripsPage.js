import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Container from "react-bootstrap/Container";
import Heading from "../layout/Heading";
import Loader from "../layout/Loader";
import ErrorMessage from "../layout/ErrorMessage";

// ⚠️ KJO ESHTE E SAKTE
import AccommodationList from "./AccommodationList";

function FavoriteTripsPage() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("accommodation")) || [];
      setFavourites(data);
    } catch (error) {
      console.log(error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem("accommodation", JSON.stringify(items));

    // 🔥 IMPORTANT: trigger header update
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const removeFavouriteAccommodation = (trip) => {
    const newList = favourites.filter((favourite) => favourite.id !== trip.id);

    setFavourites(newList);
    saveToLocalStorage(newList);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} />;
  }

  return (
    <main>
      <Helmet>
        <title>Favorites Page | Holidaze!</title>
        <meta name="description" content="Favorites Page | Holidaze!" />
      </Helmet>

      <div className="favourites">
        <Container>
          <Heading content="Favorite Trips Page" />

          {favourites.length === 0 && (
            <div>No favourite accommodation yet!</div>
          )}

          {favourites.length > 0 && (
            <AccommodationList
              accommodationsData={favourites}
              removeFavouriteAccommodation={removeFavouriteAccommodation}
            />
          )}
        </Container>
      </div>
    </main>
  );
}

export default FavoriteTripsPage;
