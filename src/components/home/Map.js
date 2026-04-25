import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "350px",
};

const center = {
  lat: 60.38805,
  lng: 5.33186,
};

const MapView = (props) => {
  center.lat = props.lat;
  center.lng = props.lng;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
        onClick={(e) => {
          console.log(e);
        }}
      >
        <Marker position={center} title={props.hotel} />
      </GoogleMap>
    </div>
  );
};

export default MapView;
