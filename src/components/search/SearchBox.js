import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function SearchBox(props) {
  return (
    <div className="search--div">
      <Form.Group>
        <i className="fas fa-search"></i>
        <Form.Control
          type="search"
          className="search"
          placeholder={props.placeholder}
          onChange={props.handleChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="search--button">
        Search
      </Button>
    </div>
  );
}

export default SearchBox;
