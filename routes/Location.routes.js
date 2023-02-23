const router = require("express").Router();
const Location = require("../models/agents.model");
const DoorstepLocs = require("../models/doorsteps.model");
var ZonePrice = require("../models/zone_pricing.model");

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

router.post("/location/searchnear", async (req, res) => {
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

router.post("/location/searchneardoorsteps", async (req, res) => {
  try {
    // let {target} = { lat: -1.1646076510754735, lng: 36.925267230040916 };
    let { target } = req.body;

    console.log(target);

    const locations = await DoorstepLocs.find().select("lng lat name price id");

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

router.post("/location/setdoorstepcoordinates", async (req, res) => {
  try {
    const body = req.body;

    const locations = Object.keys(body);

    for (let i = 0; i < locations.length; i++) {
      await DoorstepLocs.findByIdAndUpdate(locations[i], {
        lat: body[locations[i]][0],
        lng: body[locations[i]][1],
      });
    }
    return locations;
  } catch (error) {
    console.log("Search location error: ", error);
  }
});

router.post("/package/location-delivery-charge", async (req, res) => {
  try {
    let price;
    const { senderLocation, receieverLocation } = req.body;
    const senderZone = await Location.findOne({ _id: senderLocation }).populate(
      "zone"
    );
    const recieverZone = await Location.findOne({
      _id: receieverLocation,
    }).populate("zone");

    // console.log("sender", senderZone?.zone?.name)
    // console.log("reciever", recieverZone?.zone?.name)
    if (senderLocation === receieverLocation) {
      price = 100;
      return res
        .status(200)
        .json({ message: "price set successfully ", price });
    }
    if (
      senderZone?.zone.name === "Zone A" &&
      recieverZone?.zone.name === "Zone B"
    ) {
      const zones = await ZonePrice.findOne({
        deleted_at: null,
        name: "ZoneAB",
      });
      price = zones.price;
      return res
        .status(200)
        .json({ message: "price set successfully ", price });
    } else if (
      senderZone?.zone.name === "Zone A" &&
      recieverZone?.zone.name === "Zone A"
    ) {
      const zones = await ZonePrice.findOne({
        deleted_at: null,
        name: "ZoneAA",
      });
      price = zones.price;
      return res
        .status(200)
        .json({ message: "price set successfully ", price });
    } else if (
      senderZone?.zone.name === "Zone B" &&
      recieverZone?.zone.name === "Zone A"
    ) {
      const zones = await ZonePrice.findOne({
        deleted_at: null,
        name: "ZoneBA",
      });
      price = zones.price;
      return res
        .status(200)
        .json({ message: "price set successfully ", price });
    } else if (
      senderZone?.zone.name === "Zone B" &&
      recieverZone?.zone.name === "Zone B"
    ) {
      const zones = await ZonePrice.findOne({
        deleted_at: null,
        name: "ZoneBB",
      });
      price = zones.price;
      return res
        .status(200)
        .json({ message: "price set successfully ", price });
    } else if (
      senderZone?.zone.name === "Zone A" &&
      recieverZone?.zone.name === "Zone C"
    ) {
      const zones = await ZonePrice.findOne({
        deleted_at: null,
        name: "ZoneAC",
      });
      price = zones.price;

      return res
        .status(200)
        .json({ message: "price set successfully ", price });
    } else if (
      senderZone?.zone.name === "Zone B" &&
      recieverZone?.zone.name === "Zone C"
    ) {
      const zones = await ZonePrice.findOne({
        deleted_at: null,
        name: "ZoneBC",
      });
      price = zones.price;
      return res
        .status(200)
        .json({ message: "price set successfully ", price });
    } else {
      return res.status(200).json({ message: "price setting in progress  " });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

module.exports = router;
// 900,180,100,100,
