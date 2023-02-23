const router = require("express").Router();
const Location = require("../models/agents.model");

function getClosestCoordinates(target, coordinates, n) {
  // calculate distances between target and each set of coordinates
  let distances = coordinates.map((coord) => {
    let latDiff = ((target.lat - coord.lat) * Math.PI) / 180;
    let lonDiff = ((target.lng - coord.lng) * Math.PI) / 180;
    let lat1 = (coord.lat * Math.PI) / 180;
    let lat2 = (target.lat * Math.PI) / 180;
    let a =
      Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
      Math.sin(lonDiff / 2) *
        Math.sin(lonDiff / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return {
      coord: coord,
      distance: 6371 * c, // earth radius in km
    };
  });

  // sort by distance and select top N
  distances.sort((a, b) => a.distance - b.distance);
  let closest = distances.slice(0, n).map((item) => item.coord);
  return closest;
}

router.get("/location/searchnear", async (req, res) => {
  try {
    // let {target} = { lat: -1.1646076510754735, lng: 36.925267230040916 };
    let { target } = req.body;

    console.log(target);

    const locations = await Location.find().select("lng lat name zone id");

    let closest = getClosestCoordinates(target, locations, 2);
    return res.json(closest);
  } catch (error) {
    console.log("Search location error: ", error);
  }
});

router.post("/location/setcoordinates", async (req, res) => {
  try {
    const body = req.body;

    const locations = Object.keys(body);

    for (let i = 0; i < locations.length; i++) {
      await Location.findByIdAndUpdate(locations[i], {
        lat: body[locations[i]][0],
        lng: body[locations[i]][1],
      });
    }
    return locations;
  } catch (error) {
    console.log("Search location error: ", error);
  }
});

module.exports = router;
// 900,180,100,100,
