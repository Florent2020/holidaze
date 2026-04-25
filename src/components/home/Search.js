import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Search({ onSearch }) {
  const [search, setSearch] = useState("");

  const onInputChange = (value) => {
    setSearch(value);
    onSearch(value);
  };
  return (
    <div className="search--home">
      <Form.Group>
        <i className="fas fa-search"></i>
        <Form.Control
          type="search"
          className="search"
          placeholder="Search accommodation ..."
          value={search}
          onChange={(e) => onInputChange(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Search
      </Button>
    </div>
  );
}

export default Search;
