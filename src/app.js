import { Server } from "socket.io";
import { app, port } from "./index.js";
import { createMessage, getAllMessages } from "./chat/service.chat.js";

const httpServer = app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

export const io = new Server(httpServer);

io.on('connection', socket => {
    console.log(`New client connected wtih id ${socket.id}`);

    socket.on('retrieveLog', async () => {
        try {
            const data = await getAllMessages();
            io.emit('messageLogs', data.payload);
        } catch(error) {
            console.log(error);
            throw error;
        }
    });

    socket.on('message', async (data) => {
        try {
            await createMessage(data);
            const response = await getAllMessages()
            io.emit('messageLogs', response.payload);
        } catch(error) {
            console.log(error);
            throw error;
        }
    });

    socket.on('userConnected', data => {
        socket.broadcast.emit('showNotification', data);
    })
});