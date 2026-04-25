import React from "react";

const Star = (props) => {
  let list = [];
  const starView = () => {
    for (let i = 0; i <= props.stars - 1; i++) {
      list.push(<i className="fas fa-star" key={i}></i>);
    }
    return <div className="hotel--stars d-flex">{list}</div>;
  };

  return starView();
};

export default Star;
