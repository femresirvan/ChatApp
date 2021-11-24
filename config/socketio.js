// const io = require('socket.io')().listen(server);
// let io = require('socket.io');

// module.exports = {
//     init: (server) => {
//       io = require('socket.io')().listen(server);
//     //    io.origins('*:*');
//       return io;
//     },
//     getIO: () => {
//       if (!io) {
//         throw new Error("socket is not initialized");
//       }
//       return io;
//     }
//   };