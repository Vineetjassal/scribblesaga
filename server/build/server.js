"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const joinRoom_1 = require("@/lib/validations/joinRoom");
const users_1 = require("@/data/users");
const undoPoints_1 = require("@/data/undoPoints");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
function isRoomCreated(roomId) {
    const rooms = [...io.sockets.adapter.rooms];
    return rooms === null || rooms === void 0 ? void 0 : rooms.some(room => room[0] === roomId);
}
function validateJoinRoomData(socket, joinRoomData) {
    try {
        return joinRoom_1.joinRoomSchema.parse(joinRoomData);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            socket.emit('invalid-data', {
                message: 'The entities you provided are not correct and cannot be processed.',
            });
        }
    }
}
function joinRoom(socket, roomId, username) {
    socket.join(roomId);
    const user = {
        id: socket.id,
        username,
    };
    (0, users_1.addUser)(Object.assign(Object.assign({}, user), { roomId }));
    const members = (0, users_1.getRoomMembers)(roomId);
    socket.emit('room-joined', { user, roomId, members });
    socket.to(roomId).emit('update-members', members);
    socket.to(roomId).emit('send-notification', {
        title: 'New member arrived!',
        message: `${username} joined the party.`,
    });
}
function leaveRoom(socket) {
    const user = (0, users_1.getUser)(socket.id);
    if (!user)
        return;
    const { username, roomId } = user;
    (0, users_1.removeUser)(socket.id);
    const members = (0, users_1.getRoomMembers)(roomId);
    socket.to(roomId).emit('update-members', members);
    socket.to(roomId).emit('send-notification', {
        title: 'Member departure!',
        message: `${username} left the party.`,
    });
    socket.leave(roomId);
}
io.on('connection', socket => {
    socket.on('create-room', (joinRoomData) => {
        const validatedData = validateJoinRoomData(socket, joinRoomData);
        if (!validatedData)
            return;
        const { roomId, username } = validatedData;
        joinRoom(socket, roomId, username);
    });
    socket.on('join-room', (joinRoomData) => {
        const validatedData = validateJoinRoomData(socket, joinRoomData);
        if (!validatedData)
            return;
        const { roomId, username } = validatedData;
        if (isRoomCreated(roomId)) {
            return joinRoom(socket, roomId, username);
        }
        socket.emit('room-not-found', {
            message: "Oops! The Room ID you entered doesn't exist or hasn't been created yet.",
        });
    });
    socket.on('client-ready', (roomId) => {
        const members = (0, users_1.getRoomMembers)(roomId);
        // Don't need to request the room's canvas state if a user is the first member
        if (members.length === 1)
            return socket.emit('client-loaded');
        const adminMember = members[0];
        if (!adminMember)
            return;
        socket.to(adminMember.id).emit('get-canvas-state');
    });
    socket.on('send-canvas-state', ({ canvasState, roomId }) => {
        const members = (0, users_1.getRoomMembers)(roomId);
        const lastMember = members[members.length - 1];
        if (!lastMember)
            return;
        socket.to(lastMember.id).emit('canvas-state-from-server', canvasState);
    });
    socket.on('draw', ({ drawOptions, roomId }) => {
        socket.to(roomId).emit('update-canvas-state', drawOptions);
    });
    socket.on('clear-canvas', (roomId) => {
        socket.to(roomId).emit('clear-canvas');
    });
    socket.on('undo', ({ canvasState, roomId }) => {
        socket.to(roomId).emit('undo-canvas', canvasState);
    });
    socket.on('get-last-undo-point', (roomId) => {
        const lastUndoPoint = (0, undoPoints_1.getLastUndoPoint)(roomId);
        socket.emit('last-undo-point-from-server', lastUndoPoint);
    });
    socket.on('add-undo-point', ({ roomId, undoPoint }) => {
        (0, undoPoints_1.addUndoPoint)(roomId, undoPoint);
    });
    socket.on('delete-last-undo-point', (roomId) => {
        (0, undoPoints_1.deleteLastUndoPoint)(roomId);
    });
    socket.on('leave-room', () => {
        leaveRoom(socket);
    });
    socket.on('disconnect', () => {
        socket.emit('disconnected');
        leaveRoom(socket);
    });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT} now!`));
