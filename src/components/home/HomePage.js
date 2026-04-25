import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import JumbotronPage from "./Jumbotron";
import AccommodationPart from "./AccommodationPart";
import axios from "axios";
import { BASE_URL, ACCOMMODATIONS } from "../../constants/api";
import AccommodationList from "./AccommodationList";
import ErrorMessage from "../layout/ErrorMessage";
import Loader from "../layout/Loader";
import PaginationPage from "./Pagination";
import OurGuarantees from "./OurGuarantees";
import ThingsToDo from "./ThingsToDo";
import Container from "react-bootstrap/Container";
import Search from "./Search";

function HomePage() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const ITEMS_PER_PAGE = 6;

  const url = `${BASE_URL}${ACCOMMODATIONS}?_embed&acf_format=standard&per_page=100`;

  const savedAccommodation =
    JSON.parse(localStorage.getItem("accommodation")) || [];

  const [favourites, setFavourites] = useState(savedAccommodation);

  useEffect(() => {
    async function getAccommodation() {
      try {
        const response = await axios.get(url);
        setAccommodations(response.data);
      } catch (error) {
        console.log(error);
        setError(error.toString());
      } finally {
        setLoading(false);
      }
    }

    getAccommodation();
  }, [url]);

  const accommodationsData = useMemo(() => {
    let computedAccommodations = accommodations;

    if (search) {
      computedAccommodations = computedAccommodations.filter((accommodation) =>
        accommodation.title?.rendered
          ?.toLowerCase()
          .includes(search.toLowerCase()),
      );
    }

    setTotalItems(computedAccommodations.length);

    return computedAccommodations.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
    );
  }, [accommodations, currentPage, search]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} />;
  }

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

    const exists = favourites.some((favourite) => favourite.id === trip.id);

    if (exists) {
      const filtered = favourites.filter((item) => item.id !== trip.id);
      setFavourites(filtered);
      saveToLocalStorage(filtered);
    } else {
      const newFavouriteList = [...favourites, trip];
      setFavourites(newFavouriteList);
      saveToLocalStorage(newFavouriteList);
    }

    const updatedStorage =
      JSON.parse(localStorage.getItem("accommodation")) || [];

    const counterElement = document.getElementById("favorite-counter");
    if (counterElement) {
      counterElement.innerText =
        updatedStorage.length === 0 ? "" : updatedStorage.length;
    }
  };

  return (
    <main>
      <Helmet>
        <title>
          Holidaze | A website for Hotel Reservations from Luxury Hotels to
          Budget Accommodations
        </title>
        <meta
          name="description"
          content="A great page where you can find easy your accommodation!"
        />
      </Helmet>

      <JumbotronPage />
      <AccommodationPart />

      <Container className="home--container">
        <Search
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
        />

        <PaginationPage
          total={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />

        <AccommodationList
          accommodationsData={accommodationsData}
          favoriteTrips={favoriteTrips}
        />

        <PaginationPage
          total={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Container>

      <OurGuarantees />
      <ThingsToDo />
    </main>
  );
}

export default HomePage;
