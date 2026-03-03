import { memo, useRef, useEffect, useCallback } from 'react';
import type { ChatProps } from './types';
import { ChatContainer, MessageList } from './Chat.styled';
import { ChatMessageItem } from './ChatMessage';
import { ChatTemplates } from './ChatTemplates';
import { ChatInput } from './ChatInput';

const SCROLL_THRESHOLD = 80;

export const Chat = memo(function Chat({
  messages,
  onSendMessage,
  templates,
  onTemplateClick,
  placeholder,
  disabled,
  className,
}: ChatProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  const checkAutoScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    shouldAutoScroll.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el || !shouldAutoScroll.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <ChatContainer className={className}>
      <MessageList ref={listRef} onScroll={checkAutoScroll}>
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
      </MessageList>
      {templates && templates.length > 0 && onTemplateClick && (
        <ChatTemplates templates={templates} onTemplateClick={onTemplateClick} />
      )}
      <ChatInput
        onSend={onSendMessage}
        placeholder={placeholder}
        disabled={disabled}
      />
    </ChatContainer>
  );
});
