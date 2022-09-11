const callIdToRoom: { [callId: string]: string } = {};

export const getRoomByCallId = (callId: string) => callIdToRoom[callId];

export const mapCallIdToRoom = (callId: string, room: string) => {
  callIdToRoom[callId] = room;
};

export const removeRoomMapByCallId = (callId: string) => {
  delete callIdToRoom[callId];
};
