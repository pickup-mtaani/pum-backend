import React, { useMemo, useRef, useCallback, useState } from 'react'
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api'
import PIN from './../Riders/pin.png'

function Map(props) {
    const { dest, pickUp, directions, setDirections } = props;
    const mapRef = useRef();
    const center = useMemo(() => ({ lat: -1.2878412, lng: 36.8278173 }), [])
    const pickUpPoint = useMemo(() => (pickUp), [pickUp])
    const destination = useMemo(() => (dest), [dest])
    const options = useMemo(() => ({ disableDefaultUI: false, clickableIcons: false, }), [])
    const onLoad = useCallback((map) => (mapRef.current = map), []);
    const fetchDirections = (position) => {
        // if (!office) return;
        const service = new window.google.maps.DirectionsService();
        service.route(
            {
                origin: pickUpPoint,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setDirections(result);
                }
            }
        );
    };
    return <div className='w-full h-screen bg-white'>
        <GoogleMap zoom={16} center={center} options={options} onLoad={onLoad} mapContainerClassName='w-full h-screen'>
            {directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        suppressMarkers: true,
                        polylineOptions: {
                            zIndex: 50,
                            strokeColor: "#ffc107",
                            strokeWeight: 5,
                        },
                    }}
                />
            )}
            <Marker position={pickUpPoint} onClick={() => fetchDirections(pickUpPoint)} />
            <Marker position={destination} icon={PIN} />
        </GoogleMap>
    </div>
}

export default Map