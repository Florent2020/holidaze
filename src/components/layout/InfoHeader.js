import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import DarkMode from "./DarkMode";

function InfoHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const items = JSON.parse(localStorage.getItem("accommodation")) || [];
      setCount(items.length);
    };

    updateCount();

    // 🔥 listen kur ndryshon localStorage (nga favorite klikimet)
    window.addEventListener("storage", updateCount);

    // 🔥 custom trigger (nga klikimi i zemrës)
    window.addEventListener("favoritesUpdated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("favoritesUpdated", updateCount);
    };
  }, []);

  return (
    <div className="info--header">
      <Container>
        <div className="info__elem">
          <span>
            <i className="fas fa-phone-alt"></i> 123 456 789
          </span>
          <span>
            <i className="fas fa-envelope"></i> info@holidaze.com
          </span>
        </div>

        <nav className="nav--info">
          <div className="favorites__link">
            {/* {count > 0 && <span id="favorite-counter">{count}</span>} */}

            <span id="favorite-counter" className={count > 0 ? "show" : "hide"}>
              {count > 0 ? count : ""}
            </span>

            <Link to="/favoriteTrips" className="nav-link">
              <i className="far fa-heart"></i> Trips
            </Link>
          </div>

          <DarkMode />
        </nav>
      </Container>
    </div>
  );
}

export default InfoHeader;
