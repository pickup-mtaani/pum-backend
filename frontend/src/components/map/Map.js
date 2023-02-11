import { Button, HStack } from "@chakra-ui/react";
import { GoogleMap, InfoWindow, MarkerF } from "@react-google-maps/api";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect } from "react-redux";
import {
  fetchCoordinates,
  update_rider_data,
} from "../../redux/actions/track_rider.actions";
import RiderServices from "../../services/RiderServices";
import Layout from "../../views/Layouts";
import Drawer from "./Drawer";
import SideBarBtn from "./SideBarBtn";

const Map = ({ riders, coordinates: coords, fetchCoords, updateRider }) => {
  const mapRef = useRef();
  const [current, setCurrent] = useState(null);
  const [currentRiderDetails, setCurrentRiderDetails] = useState(null);
  const [cLoading, setCLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({});
  const [currentRider, setCurrentRider] = useState(riders[0]?._id);

  const [showRiderList, setShowRiderList] = useState(false);
  const center = useMemo(
    () => ({
      lat: -1.2878412,
      lng: 36.8278173,
    }),
    []
  );
  const options = useMemo(
    () => ({
      //   mapId: "b181cac70f27f5e6",
      disableDefaultUI: true,
      clickableIcons: false,
      mapId: "f2dbb0573bbff1b1",
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  useEffect(() => {
    let rider_ids = riders?.map((r) => r?._id);

    fetchCoords(rider_ids);

    const interval = setInterval(() => {
      fetchCoords(rider_ids);
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchCoords, riders]);

  useEffect(() => {
    setCoordinates(coords);
  }, [coords]);

  const getRider = useCallback(async () => {
    try {
      setCLoading(true);
      const details = await RiderServices.getCurrentRiderCoordinates(
        current?.rider?._id
      );

      setCoordinates((prev) => ({
        ...prev,
        [current?.rider?._id]: {
          _id: details?.paths?.id?._id,
          rider: details?.paths?.id?.rider,
          lng: details?.paths?.id?.lng,
          lat: details?.paths?.id?.lat,
          createdAt: details?.paths?.id?.createdAt,
        },
      }));
      setCurrentRiderDetails(details);
      setTimeout(() => {
        setCurrent(null);
      }, 2500);
      setCLoading(false);
    } catch (error) {
      console.log("FETCH CURRENT RIDER DETAILS ERROR:", error);
      setCLoading(false);
    }
  }, [current?.rider?._id]);

  const panToPoint = useCallback((lat, lng) => {
    mapRef.current?.panTo({
      lat: Number(lat),
      lng: Number(lng),
    });
    mapRef.current.setZoom(17);
    // mapRef.current.duration(1000);
  }, []);

  useEffect(() => {
    const currentRider = current?.rider?._id;
    const currentCoords = coordinates[currentRider];
    const coord = currentCoords ? currentCoords[0] : {};
    console.log(coord);
    if (coord?.lat) {
      panToPoint(coord?.lat, coord?.lng);
    }
  }, [coordinates, current, panToPoint]);

  return (
    <Layout>
      <div className="map bg-slate-300  w-full h-full overflow-y-hidden">
        <GoogleMap
          zoom={13}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
          mapContainerStyle={{
            height: "92vh",
            width: "100%",
          }}
        >
          {Object.values(coordinates)?.map((c) => (
            <MarkerF
              position={{
                lat: Number(c[0]?.lat),
                lng: Number(c[0]?.lng),
              }}
              onClick={() => setCurrent(c[0])}
              key={c[0]?._id}
              icon={{
                url:
                  currentRider !== c[0]?._id
                    ? "https://i0.wp.com/www.worth.com/wp-content/uploads/2017/09/map-marker-icon.png"
                    : "https://www.pngkey.com/png/full/48-480344_maps-clipart-map-pin-grey-google-maps-marker.png",
                scaledSize:
                  currentRider !== c[0]?._id
                    ? new window.google.maps.Size(50, 50)
                    : new window.google.maps.Size(35, 50),
              }}
            />
          ))}

          {current?._id && (
            <InfoWindow
              onCloseClick={() => {
                setCurrent(null);
              }}
              options={{
                pixelOffset: new window.google.maps.Size(0, -40),
              }}
              position={{
                lat: Number(current?.lat),
                lng: Number(current?.lng),
              }}
            >
              <div
                style={{
                  opacity: 0.75,
                  padding: 3,
                }}
              >
                <HStack>
                  <span className="font-bold">Name: </span>
                  <div className={"text"}>{current?.rider.name}</div>
                </HStack>

                <HStack>
                  <span className="font-bold">Agent: </span>
                  <div className={"text"}>
                    {currentRiderDetails?.packages?.agents || 0}{" "}
                  </div>
                </HStack>
                <HStack>
                  <span className="font-bold">Doorstep: </span>
                  <div className={"text"}>
                    {currentRiderDetails?.packages?.doorstep || 0}{" "}
                  </div>
                </HStack>
                <HStack>
                  <span className="font-bold">Errand: </span>
                  <div className={"text"}>
                    {currentRiderDetails?.packages?.errand || 0}{" "}
                  </div>
                </HStack>

                <HStack justifyContent={"center"} py={"2"}>
                  <Button
                    onClick={getRider}
                    isLoading={cLoading}
                    loadingText="fetching"
                    className="py-1 px-2 bg-slate-500 text-white rounded-sm hover:scale-[0.995] hover:text-xs hover:font-semibold duration-300"
                  >
                    Refetch
                  </Button>
                </HStack>
              </div>
            </InfoWindow>
          )}

          {/* </Marker> */}
        </GoogleMap>
      </div>

      <Drawer
        handleHide={() => setShowRiderList(false)}
        isOpen={showRiderList}
        handlePan={(lat, lng, id) => {
          setCurrentRider(id);
          setCurrent(coords[id][0]);
          panToPoint(lat, lng);
        }}
      />
      <SideBarBtn handleClick={() => setShowRiderList(true)} />
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  riders: state.userDetails.riders,
  coordinates: state.tracker.coordinates,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCoords: (r) => dispatch(fetchCoordinates(r)),
  updateRider: (data) => dispatch(update_rider_data(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
