var User = require("./../models/rider.model");

const rider_coordinates = [
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.0073644962468673025, longitude: 36.82597557082772, latitude: -1.2860405570358835 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364495563964013, longitude: 36.82606877759099, latitude: -1.2862772023457005 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364494839331659, longitude: 36.82620523497462, latitude: -1.2865282608727795 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364494007133349, longitude: 36.82633062824607, latitude: -1.2868165256397588 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364493348007928, longitude: 36.82646809145808, latitude: -1.287044791089099 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364492313106208, longitude: 36.82664478197694, latitude: -1.287403110820799 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.00736449149873164, longitude: 36.82682918384671, latitude: -1.28768500685121 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364490482709929, longitude: 36.8269850872457, latitude: -1.2880366226647253 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364489419882769, longitude: 36.82714065536857, latitude: -1.2884043276151362 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364488632975563, longitude: 36.82732002809644, latitude: -1.2886765029863674 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364488342209263, longitude: 36.82764222845435, latitude: -1.2887770603821702 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364488734740604, longitude: 36.828008349984884, latitude: -1.2886413078969015 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364489133047769, longitude: 36.82831244543195, latitude: -1.2885035442562873 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364489763853621, longitude: 36.828607488423586, latitude: -1.2882853346789256 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.00736449023180219, longitude: 36.8289122544229, latitude: -1.2881234372384769 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364490514667921, longitude: 36.82920495048165, latitude: -1.2880255613481675 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364490785892963, longitude: 36.82945439592004, latitude: -1.2879317077511896 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364491263396111, longitude: 36.82967199012637, latitude: -1.287766458373823 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364491641093318, longitude: 36.82999989017844, latitude: -1.2876357337066469 },
  { longitudeDelta: 0.0035643205046653748, latitudeDelta: 0.007364492337316619, longitude: 36.830092426389456, latitude: -1.287394731033449 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957817388566488, longitude: 36.8307257629931, latitude: -1.287403112274783 },
  { longitudeDelta: 0.0023995712399411673, latitudeDelta: 0.0049578178239335635, longitude: 36.83105232194066, latitude: -1.287179204347069 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957818373266143, longitude: 36.831310484558344, latitude: -1.286896637877289 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957818919863577, longitude: 36.83153981342912, latitude: -1.2866154121425941 },
  { longitudeDelta: 0.0023995712399411673, latitudeDelta: 0.004957819386234741, longitude: 36.83168163523078, latitude: -1.2863754149475812 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957819823230292, longitude: 36.83172320947051, latitude: -1.286150501354672 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957820188510542, longitude: 36.83187844231725, latitude: -1.2859624588273553 },
  { longitudeDelta: 0.002399571239955378, latitudeDelta: 0.004957820611028119, longitude: 36.83198573067784, latitude: -1.2857449194157269 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957820981410066, longitude: 36.8320675380528, latitude: -1.2855541953246363 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957821249556238, longitude: 36.832141634076834, latitude: -1.2854160963253634 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957821546951013, longitude: 36.83222008869052, latitude: -1.2852629136887845 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957822029110215, longitude: 36.832301896065474, latitude: -1.2850145365714392 },
  { longitudeDelta: 0.0023995712399411673, latitudeDelta: 0.004957822476041818, longitude: 36.8324732221663, latitude: -1.2847842597892467 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957822970363512, longitude: 36.83262141421437, latitude: -1.2845295139798163 },
  { longitudeDelta: 0.002399571239955378, latitudeDelta: 0.004957823535459038, longitude: 36.83279173448682, latitude: -1.2842382322271173 },
  { longitudeDelta: 0.0023995712399482727, latitudeDelta: 0.004957823973027242, longitude: 36.83291109278798, latitude: -1.2840126480621206 },
]
module.exports = (http) => {
  const io = require("socket.io")(http, {
    cors: {
      origin: ["http://localhost:3000", "https://learnnia.com"],
    },
  });
  let riders = [];
  let rooms = {};

  io.on("connection", (socket) => {

    // console.log(rider_coordinates)
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
      console.log("change location:", rider_id, coordinates);
      socket.to(rider_id).emit("position-changed", { coordinates });
      // grab the coordinates
      // send the coordinates to rider's room.
    };

    socket.on("start-ride", (data) => {
      createRoom(data?.rider_id);
      {
        const changeLoc = (coord) => {
          console.log(coord)

          riderChangedLocation({
            rider_id: data.rider_id,
            coordinates: coord,
          })
        }

        for (let i = 1; i <= rider_coordinates.length; i++) {
          setTimeout(function () {
            // console.log();
            changeLoc(rider_coordinates[i - 1])
          }, 1000 * i);
        }
      }

    });

    //

    socket.on("track_rider", (data) => {
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
