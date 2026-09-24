import React from 'react';
import { ChatContainer } from '../components/chat/ChatContainer';

interface ChatroomPageProps {
  initialRoomId?: string;
}

export const ChatroomPage: React.FC<ChatroomPageProps> = ({ initialRoomId }) => {
  return (
    <div className="w-full max-w-full pb-6">
      <ChatContainer initialRoomId={initialRoomId} />
    </div>
  );
};

export default ChatroomPage;
