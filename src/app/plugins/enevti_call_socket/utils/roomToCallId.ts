const roomToCallId: { [room: string]: string } = {};

export const getCallIdByRoom = (room: string) => roomToCallId[room];

export const mapRoomToCallId = (room: string, callId: string) => {
  roomToCallId[room] = callId;
};

export const removeCallIdMapByRoom = (room: string) => {
  delete roomToCallId[room];
};
