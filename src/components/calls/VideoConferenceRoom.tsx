import React from 'react';
import { WhatsAppCallRoom, WhatsAppCallRoomProps } from './WhatsAppCallRoom';

export interface VideoConferenceRoomProps extends WhatsAppCallRoomProps {}

export const VideoConferenceRoom: React.FC<VideoConferenceRoomProps> = (props) => {
  return <WhatsAppCallRoom {...props} />;
};

export default VideoConferenceRoom;
