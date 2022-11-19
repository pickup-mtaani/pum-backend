import React, { useState, useEffect } from 'react';
import { useGoogleMap } from '@ubilabs/google-maps-react-hooks';
import PIN from './../Riders/pin.png'

/**
 * Component to render all map markers
 */
const MapMarkers = (props) => {

  const { origin, destination } = props;

  console.log(destination);

  const locations = [
    {
      name: 'origin',
      position: origin,
    },
    {
      name: 'destination',
      position: destination,
      icon: PIN
    },
  ];

  // Get the global map instance with the useGoogleMap hook
  const map = useGoogleMap();

  const [, setMarkers] = useState([]);

  // Add markers to the map
  useEffect(() => {
    if (!map) {
      return () => { };
    }

    const initialBounds = new window.google.maps.LatLngBounds();

    const locationMarkers = locations.map(loc => {
      const { position, name, icon } = loc;

      const markerOptions = {
        map,
        position,
        icon,
        title: name,
        clickable: true
      };

      initialBounds.extend(position);

      return new window.google.maps.Marker(markerOptions);
    });

    // Set the center of the map to fit markers
    map.setCenter(initialBounds.getCenter());

    setMarkers(locationMarkers);

    // Clean up markers
    return () => {
      locationMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map]);

  return null;
};

export default MapMarkers;