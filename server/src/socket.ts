import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    /*
     * Crear Sala y/o Conectarse
     */
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log({ roomName });
    
      const existingRoom = Object.values(rooms).find((room) => room.name === roomName);
    
      if (existingRoom) {
        const roomId = Object.keys(rooms).find((key) => rooms[key].name === roomName);
        if (roomId) {
          socket.join(roomId);
          socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
          socket.emit(EVENTS.SERVER.ROOMS, rooms); // Emitir las salas al usuario que se ha unido
        }
      } else {
        const roomId = nanoid();
        rooms[roomId] = {
          name: roomName,
        };
    
        socket.join(roomId);
        socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
        socket.emit(EVENTS.SERVER.ROOMS, rooms);
        socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
      }
    });
      
    

    /*
     * When a user sends a room message
     */

    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        const date = new Date();

        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );

    /*
     * When a user joins a room
     */
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId);

      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;


//------------------------------------------------------------------------------

// import { nanoid } from "nanoid";
// import { Server, Socket } from "socket.io";
// import logger from "./utils/logger";

// const EVENTS = {
//   connection: "connection",
//   CLIENT: {
//     CREATE_ROOM: "CREATE_ROOM",
//     SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
//     JOIN_ROOM: "JOIN_ROOM",
//   },
//   SERVER: {
//     ROOMS: "ROOMS",
//     JOINED_ROOM: "JOINED_ROOM",
//     ROOM_MESSAGE: "ROOM_MESSAGE",
//     CHAT_HISTORY: "CHAT_HISTORY",
//   },
// };

// const rooms: Record<string, { name: string }> = {};
// const chatHistories: Record<string, Array<{ message: string; username: string; time: string }>> = {};

// function socket({ io }: { io: Server }) {
//   logger.info(`Sockets enabled`);

//   io.on(EVENTS.connection, (socket: Socket) => {
//     logger.info(`User connected ${socket.id}`);

//     socket.emit(EVENTS.SERVER.ROOMS, rooms);

//     // Crear Sala y/o Conectarse
//     socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
//       console.log({ roomName });
    
//       const existingRoom = Object.values(rooms).find((room) => room.name === roomName);
    
//       if (existingRoom) {
//         const roomId = Object.keys(rooms).find((key) => rooms[key].name === roomName);
//         if (roomId) {
//           socket.join(roomId);
//           socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
//           socket.emit(EVENTS.SERVER.ROOMS, rooms); // Emitir las salas al usuario que se ha unido
//         }
//       } else {
//         const roomId = nanoid();
//         rooms[roomId] = {
//           name: roomName,
//         };
    
//         socket.join(roomId);
//         socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
//         socket.emit(EVENTS.SERVER.ROOMS, rooms);
//         socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
//         // Enviar el historial del chat al usuario que se unió
//       socket.emit(EVENTS.SERVER.CHAT_HISTORY, chatHistories[roomId] || []);
//       }      
//     });

//     // When a user sends a room message
//     socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({ roomId, message, username }) => {
//       const date = new Date();
//       const formattedTime = `${date.getHours()}:${date.getMinutes()}`;

//       // Almacenar el mensaje en el historial del chat
//       if (!chatHistories[roomId]) {
//         chatHistories[roomId] = [];
//       }
//       chatHistories[roomId].push({ message, username, time: formattedTime });

//       socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
//         message,
//         username,
//         time: formattedTime,
//       });
//     });

//     // When a user joins a room
//     socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
//       socket.join(roomId);
//       socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);

//       // Enviar el historial del chat al usuario que se unió
//       socket.emit(EVENTS.SERVER.CHAT_HISTORY, chatHistories[roomId] || []);
//     });
//   });
// }

// export default socket;