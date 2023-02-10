import React, { useCallback, useRef } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import PlaceInfo from "./PlaceInfo";

const libraries = ["places"];
const mapContainerStyle = {
  height: "60vh",
  width: "100%",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function GoogleMapComponent() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <GoogleMap
      id="map"
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={{
        lat: -1.2878412,
        lng: 36.8278173,
      }}
      options={options}
      onLoad={onMapLoad}
    >
      <PlaceInfo />
    </GoogleMap>
  );
}
