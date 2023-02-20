import { Center } from "@chakra-ui/react";
import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/map/Map";
import Layout from "../views/Layouts";
function Tracker() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDctWcs7BwfAxWypCIhI2tnEOyIi5FCqLk",
  });

  if (!isLoaded) {
    return (
      <Layout>
        <Center h={"92vh"} bg={"#fff"} overflowY={"hidden"}>
          <span className="text-3xl font-semibold text-gray-70">
            Loading . . .
          </span>
        </Center>
      </Layout>
    );
  } else {
    return <Map />;
  }
}

export default Tracker;
