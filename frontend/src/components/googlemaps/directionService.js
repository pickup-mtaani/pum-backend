import { useEffect } from 'react';
import { useDirectionsService, useGoogleMap } from '@ubilabs/google-maps-react-hooks';

const DirectionsService = (props) => {
  const { origin, destination } = props;
  const map = useGoogleMap();
  const directionsOptions = {
    renderOnMap: true,
    renderOptions: {
      suppressMarkers: true,
      polylineOptions: { strokeColor: '#fdd835', strokeWeight: 4, geodesic: true }
    }
  };

  // Use findAndRenderRoute to get directions and render a route to the map
  const { findAndRenderRoute, directionsRenderer } =
    useDirectionsService(directionsOptions);

  useEffect(() => {
    if (!findAndRenderRoute) {
      return () => { };
    }

    // Form Request to pass to findAndRenderRoute
    // https://developers.google.com/maps/documentation/javascript/directions#DirectionsRequests
    const request = {
      travelMode: 'DRIVING',
      origin,
      destination,
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: 'bestguess'
      }
    };

    findAndRenderRoute(request)
      .then((result) => {
        // eslint-disable-next-line no-console
        console.log(result);
      })
      .catch((errorStatus) => {
        console.error(errorStatus);
      });

    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [findAndRenderRoute]);

  return null;
};

export default DirectionsService;