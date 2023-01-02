var User = require("./../models/rider.model");
var Path = require("./../models/riderroute.model");
module.exports = (http) => {
  const io = require("socket.io")(http, {
    cors: {
      origin: ["http://localhost:3000", "https://65a3-217-21-116-210.eu.ngrok.io/api/", "https://stagingapi.pickupmtaani.com/", "https://stagingapi.pickupmtaani.com/"],
    },
  });
  // global.io = io;
  let riders = [];
  let rooms = {};
  let notificationrooms = [];

  io.on("connection", (socket) => {
    // console.log("first connected")
    let rider = null;
    const createRoom = (rider_id) => {
      const roomId = rider_id;
      rooms[roomId] = [];
      // rooms.push({ [roomId]: [] })
      socket.join(roomId);
      console.log("roomsA" + JSON.stringify(rooms));

      socket.emit("room-created", { roomId });

      console.log("User created room");
    };


    const joinRoom = (roomId, userId) => {
      console.log("Join rooms: ", JSON.stringify(rooms));
      console.log(rooms[roomId]);

      if (rooms[roomId]) {
        console.log("user joined the room: ", roomId);

        if (!rooms[roomId].includes(userId)) {
          rooms[roomId].push(userId);
        }
        console.log("joined users: ", rooms[roomId]);
        socket.join(roomId);
        socket.to(roomId).emit("user-joined");

        socket.emit("get-users", {
          roomId,
          participants: rooms[roomId],
        });
      }

      // console.log('riders' + ""+ JSON.stringify(riders));

      // socket.on("position-change", (data) => {
      // console.log(data)
      //     // let my_rider = riders.filter(rider =>(Object.keys(rider)[0] ===data.rider_id))[0]
      //     // console.log('my'+ JSON.stringify(my_rider));
      //     // io.emit("position-change", {
      //     //     coordinates: {
      //     //       speed: 0,
      //     //       heading: 0,
      //     //       altitude: 0,
      //     //       accuracy: 2400,
      //     //       longitude: 36.9734158,
      //     //       latitude: -0.5931579
      //     //     }
      //     //   });

      // });
    };

    const riderChangedLocation = async ({ rider_id, coordinates }) => {
      console.log("change location:", rider_id, coordinates);
      socket.broadcast.emit(`rider-${rider_id}`, { coordinates });
      // socket.to(rider_id).emit("position-changed", { coordinates });

      await new Path({ rider: rider_id, lng: coordinates.longitude, lat: coordinates.latitude }).save();
      // grab the coordinates
      // send the coordinates to rider's room.
    };//console. ya on connection inatokea?

    socket.on("start-ride", (data) => {
      // console.log(data);
      createRoom(data?.rider_id);
      {
        socket.on("position-change", (data_2) => {
          // console.log("POSITION CHANGED:", data_2);
          riderChangedLocation({
            rider_id: data.rider_id,
            coordinates: data_2?.coordinates,
          })
        })
        const changeLoc = (coord) => {
          console.log(coord)

        }
      }

    });
    socket.on("seller-notification", (data) => {

      const index = notificationrooms.findIndex(object => object.seller === data.id);
      if (index === -1) {
        notificationrooms.push({ seller: data?.id, socket: socket.id });
      } else {
        notificationrooms[index] = { seller: data?.id, socket: socket.id }
      }
      global.sellers = notificationrooms

      console.log("first", global.sellers)
      // setRoom
    });
    socket.emit("riders", (notificationrooms))
    //

    socket.on("track_rider", (data) => {
      console.log("Tracking rider:", data)
      joinRoom(data?.rider_id, data.user_id);
      // let my_rider = riders.filter(rider => (Object.keys(rider)[0] === data.rider_id))[0]
      // console.log('my' + JSON.stringify(rooms));
    });

    socket.on("disconnect", () => {
      // riders = riders.filter((u) => u.socketId !== socket.id);
      socket.broadcast.emit("riders", riders);
    });
    // console.log(users);
  });

  return io

  // socket.on("position-change", (data) => {
  //     users = users.map((u) => {
  //         if (u.socketId === data.socketId) {
  //             return data;
  //         }
  //         return u;
  //     });

  //     io.emit("position-change", data);
  //     console.log(users);
  // });
};
