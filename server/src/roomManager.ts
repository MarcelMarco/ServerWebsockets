import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import { Challenge } from "./model/Challenge";
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

function createRoom(io: Server, socket: Socket, roomName: string) {
  const roomId = nanoid();
  rooms[roomId] = {
    name: roomName,
  };

  socket.join(roomId);
  socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
  socket.emit(EVENTS.SERVER.ROOMS, rooms);
  socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
}

function setChallengeRooms(io: Server, socket: Socket, challengeList: Challenge[]) {
    for (const challenge of challengeList) {
      if (
        challenge.name &&
        !Object.values(rooms).some((room) => room.name === challenge.name) &&
        challenge.name !== rooms[Object.keys(rooms)[challengeList.indexOf(challenge)]].name
      ) {
        createRoom(io, socket, challenge.name);
      }
    }
  }
  

export { createRoom, setChallengeRooms };
