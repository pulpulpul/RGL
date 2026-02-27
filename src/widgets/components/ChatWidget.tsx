import { memo } from 'react';
import styled from 'styled-components';
import type { WidgetTypeProps } from './types';

const Wrapper = styled.div`
  padding: 8px 12px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Message = styled.div`
  padding: 6px 10px;
  background: #1a1a2e;
  border-radius: 6px;
`;

const Author = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #60a5fa;
  margin-right: 6px;
`;

const BotAuthor = styled(Author)`
  color: #a78bfa;
`;

const Text = styled.span`
  font-size: 12px;
  color: #ccc;
  line-height: 1.4;
`;

function parseMessage(item: string) {
  const colonIndex = item.indexOf(':');
  if (colonIndex === -1) return { author: '', text: item, isBot: false };
  const author = item.slice(0, colonIndex).trim();
  const text = item.slice(colonIndex + 1).trim();
  const isBot = author.includes('bot') || author.includes('signal');
  return { author, text, isBot };
}

export const ChatWidget = memo(function ChatWidget({ tab }: WidgetTypeProps) {
  return (
    <Wrapper>
      {tab.items.map((item, i) => {
        const parsed = parseMessage(item);
        const AuthorTag = parsed.isBot ? BotAuthor : Author;
        return (
          <Message key={i}>
            {parsed.author && <AuthorTag>{parsed.author}</AuthorTag>}
            <Text>{parsed.text}</Text>
          </Message>
        );
      })}
    </Wrapper>
  );
});
