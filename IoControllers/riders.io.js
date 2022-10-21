var User = require("./../models/rider.model");

module.exports = (http) => {
  const io = require("socket.io")(http, {
    cors: {
      origin: ["http://stagingapi.pickupmtaani.com/", "https://stagingapi.pickupmtaani.com/"],
    },
  });
  let riders = [];
  let rooms = {};

  io.on("connection", (socket) => {

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

    const riderChangedLocation = ({ rider_id, coordinates }) => {
      // console.log("change location:", rider_id, coordinates);
      socket.to(rider_id).emit("position-changed", { coordinates }); ''
      // grab the coordinates
      // send the coordinates to rider's room.
    };//console. ya on connection inatokea?

    socket.on("start-ride", (data) => {
      // console.log(data);
      createRoom(data?.rider_id);
      {
        socket.on("position-change", (data_2) => {
          console.log("POSITION CHANGED:", data_2);
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
