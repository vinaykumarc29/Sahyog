const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // user joins their own room using their userId
    socket.on('joinRoom', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('sendMessage', ({ receiverId, message }) => {
      io.to(receiverId).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export default socketHandler;