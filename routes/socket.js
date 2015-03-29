module.exports = function (socket) {
  socket.on('slidechanged', function(data) {
    socket.broadcast.emit(data.socketId, data);
  });
};
