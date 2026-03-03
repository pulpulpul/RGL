import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: #12121f;
  border-radius: 6px;
  overflow: hidden;
`;

export const MessageList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #2a2a3e;
    border-radius: 2px;
  }
`;

export const MessageBubble = styled.div<{ $role: 'user' | 'assistant' | 'system' }>`
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
  align-self: ${(p) =>
    p.$role === 'user' ? 'flex-end' : 'flex-start'};
  background: ${(p) =>
    p.$role === 'user'
      ? '#646cff'
      : p.$role === 'system'
        ? 'rgba(200, 166, 50, 0.15)'
        : '#1e1e38'};
  color: ${(p) =>
    p.$role === 'system' ? '#c8a632' : '#e0e0e0'};
  border: ${(p) =>
    p.$role === 'system' ? '1px solid rgba(200, 166, 50, 0.25)' : 'none'};
`;

export const MessageTime = styled.span<{ $role: 'user' | 'assistant' | 'system' }>`
  display: block;
  font-size: 9px;
  margin-top: 4px;
  opacity: 0.5;
  text-align: ${(p) => (p.$role === 'user' ? 'right' : 'left')};
`;

export const TemplatesRow = styled.div`
  display: flex;
  gap: 6px;
  padding: 8px 12px 0;
  flex-wrap: wrap;
`;

export const TemplatePill = styled.button`
  padding: 4px 10px;
  font-size: 11px;
  background: #1e1e38;
  color: #888;
  border: 1px solid #2a2a3e;
  border-radius: 12px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;

  &:hover {
    color: #fff;
    border-color: #444;
  }
`;

export const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 12px 12px;
  border-top: 1px solid #2a2a3e;
`;

export const TextInput = styled.textarea`
  flex: 1;
  min-height: 32px;
  max-height: 96px;
  padding: 6px 10px;
  background: #1a1a2e;
  border: 1px solid #2a2a3e;
  border-radius: 6px;
  color: #e0e0e0;
  font-size: 12px;
  font-family: inherit;
  line-height: 1.4;
  resize: none;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder {
    color: #555;
  }

  &:focus {
    border-color: #444;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button<{ $hasContent: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${(p) => (p.$hasContent ? '#646cff' : '#1a1a2e')};
  border: 1px solid ${(p) => (p.$hasContent ? '#646cff' : '#2a2a3e')};
  border-radius: 6px;
  color: ${(p) => (p.$hasContent ? '#fff' : '#555')};
  cursor: ${(p) => (p.$hasContent ? 'pointer' : 'default')};
  flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s, color 0.15s;

  &:hover {
    background: ${(p) => (p.$hasContent ? '#5558dd' : '#1a1a2e')};
  }
`;
