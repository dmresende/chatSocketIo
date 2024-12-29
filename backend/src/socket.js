export function initializeSocket(io, db) {
  io.on('connection', async (socket) => {
    socket.on('chat message', async (msg, clientOffset) => {
      try {
        const result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
        io.emit('chat message', msg, result.lastID);
      } catch (e) {
        if (e.errno !== 19) {
          console.error('Error saving message:', e);
        }
      }
    });

    if (!socket.recovered) {
      try {
        const messages = await db.all('SELECT id, content FROM messages WHERE id > ? LIMIT 50',
          [socket.handshake.auth.serverOffset || 0]);

        messages.forEach(row => {
          socket.emit('chat message', row.content, row.id);
        });
      } catch (e) {
        console.error('Error recovering messages:', e);
      }
    }
  });
}