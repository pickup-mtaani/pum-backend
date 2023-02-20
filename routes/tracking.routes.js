const router = require("express").Router();

var SentPackage = require("models/package.modal.js");
var DoorstepSentPackage = require("models/doorStep_delivery_packages.model");
var ErrandPackage = require("models/erand_delivery_packages.model");
var Path = require("./../models/riderroute.model");
var {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");

router.get("/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    const id = req?.params.id; //package id
    const type = req.query?.type;

    let currentRiderPath;

    if (type === "doorstep") {
      //   check if package is on transit
      const currentPkg = await DoorstepSentPackage.findById(id);

      if (
        currentPkg?.state !== "on-transit" &&
        currentPkg?.state !== "warehouse-transit"
      ) {
        return res.status(200).json({ message: "package not on delivery" });
      }

      //   get rider assigned package location.
      const assignedRider = currentPkg?.assignedTo?.toString();
      //   get rider location
      currentRiderPath = await Path.findOne({
        rider: assignedRider,
      })
        .select("lng lat heading createdAt rider ")
        .populate({
          path: "rider",
          select: "name",
        })
        .sort({ createdAt: -1 })
        .limit(1);
    } else if (type === "agent") {
      const currentPkg = await SentPackage.findById(id);

      if (
        currentPkg?.state !== "on-transit" &&
        currentPkg?.state !== "warehouse-transit"
      ) {
        return res.status(200).json({ message: "package not on delivery" });
      }

      //   get rider assigned package location.
      const assignedRider = currentPkg?.assignedTo?.toString();
      //   get rider location
      currentRiderPath = await Path.findOne({
        rider: assignedRider,
      })
        .select("lng lat heading createdAt rider ")
        .populate({
          path: "rider",
          select: "name",
        })
        .sort({ createdAt: -1 })
        .limit(1);
    } else if (type === "courier") {
      const currentPkg = await ErrandPackage.findById(id);

      console.log(currentPkg?.state === "on-transit");
      if (
        currentPkg?.state !== "on-transit" &&
        currentPkg?.state !== "warehouse-transit"
      ) {
        return res.status(200).json({ message: "package not on delivery" });
      }

      //   get rider assigned package location.
      const assignedRider = currentPkg?.assignedTo?.toString();
      //   get rider location
      currentRiderPath = await Path.findOne({
        rider: assignedRider,
      })
        .select("lng lat heading createdAt rider ")
        .populate({
          path: "rider",
          select: "name",
        })
        .sort({ createdAt: -1 })
        .limit(1);
    }

    return res
      .status(200)
      .json({ message: "current location", location: currentRiderPath });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

module.exports = router;
