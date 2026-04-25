import React from "react";
import { useState } from "react";
import SearchBox from "./SearchBox";

function Search({ accommodations }) {
  const [searchField, setSearchField] = useState("");

  const filteredHotel = accommodations.filter((item) =>
    item.name.toLowerCase().includes(searchField.toLowerCase())
  );

  console.log(filteredHotel);

  return (
    <div>
      <SearchBox
        placeholder="Search accommodation ..."
        handleChange={(e) => setSearchField(e.target.value)}
      />
    </div>
  );
}

export default Search;
