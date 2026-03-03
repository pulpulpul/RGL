import { memo } from 'react';
import styled from 'styled-components';
import type { ChatMessage as ChatMessageType } from './types';
import { MessageBubble, MessageTime } from './Chat.styled';

const MessageRow = styled.div<{ $role: 'user' | 'assistant' | 'system' }>`
  display: flex;
  flex-direction: column;
  align-items: ${(p) => (p.$role === 'user' ? 'flex-end' : 'flex-start')};
`;

interface ChatMessageProps {
  message: ChatMessageType;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ChatMessageItem = memo(
  function ChatMessageItem({ message }: ChatMessageProps) {
    return (
      <MessageRow $role={message.role}>
        <MessageBubble $role={message.role}>
          {message.content}
        </MessageBubble>
        <MessageTime $role={message.role}>
          {formatTime(message.timestamp)}
        </MessageTime>
      </MessageRow>
    );
  },
  (prev, next) => prev.message.id === next.message.id,
);
