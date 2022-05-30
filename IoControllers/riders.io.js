var User = require('./../models/rider.model')
module.exports = (http) => {
    const io = require('socket.io')(http, {
        cors: {
            origin: ["http://localhost:3000", "https://learnnia.com"]
        }
    })
    let users = []

  

    io.on('connection', socket => {

        socket.on("start-ride", data => {
            console.log(data)
            const user = {
                socketId: socket.id,
                coords: data,
            };

            users.push(user);
           
            socket.broadcast.emit("new-user", user);
            socket.emit("current-user", user);
            socket.emit("users", users);
        })
        
        socket.on("position-change", (data) => {
            users = users.map((u) => {
                if (u.socketId === data.socketId) {
                    console.log(data)
                    return data;
                }
                return u;
            });

            io.emit("position-change", data);
            
        });

        socket.on("disconnect", () => {
            users = users.filter((u) => u.socketId !== socket.id);
            socket.broadcast.emit("users", users);
        });
        console.log(users);
    })

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
}