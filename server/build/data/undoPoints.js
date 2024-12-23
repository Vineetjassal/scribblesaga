"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLastUndoPoint = exports.getLastUndoPoint = exports.addUndoPoint = void 0;
const undoPoints = {};
const addUndoPoint = (roomId, undoPoint) => {
    const room = undoPoints[roomId];
    if (room) {
        return room.push(undoPoint);
    }
    undoPoints[roomId] = [undoPoint];
};
exports.addUndoPoint = addUndoPoint;
const getLastUndoPoint = (roomId) => {
    const roomUndoPoints = undoPoints[roomId];
    if (!roomUndoPoints)
        return;
    return roomUndoPoints[roomUndoPoints.length - 1];
};
exports.getLastUndoPoint = getLastUndoPoint;
const deleteLastUndoPoint = (roomId) => {
    const room = undoPoints[roomId];
    if (!room)
        return;
    undoPoints[roomId].pop();
};
exports.deleteLastUndoPoint = deleteLastUndoPoint;
