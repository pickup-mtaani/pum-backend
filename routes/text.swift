const roomHandler = (socket) => {
  const createRoom = () => {
    const roomId = shortid.generate();
    rooms[roomId] = [];
    socket.join(roomId);
    socket.emit("room-created", { roomId });

    console.log("User created room");
  };

  const joinRoom = ({ roomId, peerId }) => {
    if (rooms[roomId]) {
      console.log("user joined the room: ", roomId, peerId);

      if (!rooms[roomId].includes(peerId)) {
        rooms[roomId].push(peerId);
      }
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { peerId });

      socket.emit("get-users", {
        roomId,
        participants: rooms[roomId],
      });
    }

    socket.on("disconnect", () => {
      console.log("user left the room", peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ peerId, roomId }) => {
    rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};