const router = require("express").Router();

var Sent_package = require("models/package.modal.js");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var Erand_package = require("models/erand_delivery_packages.model");

router.get("/collect/agent", async (req, res) => {
  try {
    const { rider, state } = req.query;

    let agentPkgs = {};

    const packages = await Sent_package.find({
      assignedTo: rider.toString(),
      state,
    })
      .populate({
        path: "senderAgentID",
        select: "business_name location_id, user",
        populate: {
          path: "user",
          select: "_id",
        },
      })
      .populate({
        path: "businessId",
        select: "name ",
      });

    for (let i = 0; i < packages.length; i++) {
      agentPkgs[packages[i]?.senderAgentID?._id] = agentPkgs[
        packages[i]?.senderAgentID?._id
      ]
        ? [...agentPkgs[packages[i]?.senderAgentID?._id], packages[i]]
        : [packages[i]];
    }

    return res.status(200).json(agentPkgs);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.get(
  "/collect/doorstep",

  async (req, res) => {
    try {
      const { rider, state } = req.query;

      let doorstepPkgs = {};

      const packages = await Door_step_Sent_package.find({
        assignedTo: rider,
        state,
      })
        .populate({
          path: "agent",
          select: "business_name location_id user",
          populate: {
            path: "user",
            select: "_id",
          },
        })
        .populate({
          path: "businessId",
          select: "name ",
        });

      for (let i = 0; i < packages.length; i++) {
        doorstepPkgs[packages[i]?.agent?._id] = doorstepPkgs[
          packages[i]?.agent?._id
        ]
          ? [...doorstepPkgs[packages[i]?.agent?._id], packages[i]]
          : [packages[i]];
      }

      return res.status(200).json(doorstepPkgs);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);

router.get(
  "/collect/errand",

  async (req, res) => {
    try {
      const { rider, state } = req.query;

      let errandPkgs = {};

      const packages = await Erand_package.find({
        assignedTo: rider,
        state,
      })
        .populate({
          path: "agent",
          select: "business_name location_id",
          populate: {
            path: "user",
            select: "_id",
          },
        })
        .populate({
          path: "businessId",
          select: "name ",
        });

      for (let i = 0; i < packages.length; i++) {
        errandPkgs[packages[i]?.agent?._id] = errandPkgs[
          packages[i]?.agent?._id
        ]
          ? [...errandPkgs[packages[i]?.agent?._id], packages[i]]
          : [packages[i]];
      }

      return res.status(200).json(errandPkgs);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  }
);

module.exports = router;
