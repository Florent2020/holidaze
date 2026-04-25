import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { BASE_URL, ACCOMMODATIONS } from "../../constants/api";
import AccommodationsList from "./AccommodationsList";
import JumbotronAccommodations from "./JumbotronAccommodations";
import SubHeading from "../layout/SubHeading";
import Container from "react-bootstrap/Container";
import SearchBox from "../search/SearchBox";
import Loader from "../layout/Loader";
import ErrorMessage from "../layout/ErrorMessage";

function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchField, setSearchField] = useState("");

  const url = `${BASE_URL}${ACCOMMODATIONS}?_embed&acf_format=standard&per_page=100`;

  useEffect(() => {
    async function getAccommodations() {
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

    getAccommodations();
  }, [url]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} />;
  }

  const filteredAccommodation = accommodations.filter((item) =>
    item.title?.rendered?.toLowerCase().includes(searchField.toLowerCase()),
  );

  return (
    <main>
      <Helmet>
        <title>
          Book Accommodations | Cancel Free on Most Accommodations | at
          Holidaze!
        </title>
        <meta
          name="description"
          content="Exclusive Deals, Central Locations! Search & Book Cheap Accommodations Online at Holidaze!"
        />
      </Helmet>

      <JumbotronAccommodations />

      <Container className="accommodations--page">
        <SubHeading content="Accommodations Page" />
        <SearchBox
          placeholder="Search accommodation ..."
          handleChange={(e) => setSearchField(e.target.value)}
        />
        <AccommodationsList accommodationsData={filteredAccommodation} />
      </Container>
    </main>
  );
}

export default AccommodationsPage;
