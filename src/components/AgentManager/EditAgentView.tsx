import { memo, useState, useCallback, useMemo } from 'react';
import type { AgentData } from '../../store/dashboard/types';
import { Chat } from '../Chat';
import type { ChatMessage } from '../Chat';
import { ChatWrapper } from './AgentManager.styled';

interface EditAgentViewProps {
  agent: AgentData;
  onUpdateAgent: (id: string, instruction: string) => void;
}

export const EditAgentView = memo(function EditAgentView({
  agent,
  onUpdateAgent,
}: EditAgentViewProps) {
  const systemMsg = useMemo<ChatMessage>(
    () => ({
      id: 'system-edit',
      role: 'system',
      content: `Current instruction:\n"${agent.instruction}"\n\nSend a new message to update this agent's instruction.`,
      timestamp: new Date().toISOString(),
    }),
    [agent.instruction],
  );

  const [messages, setMessages] = useState<ChatMessage[]>([systemMsg]);

  const handleSend = useCallback(
    (content: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      onUpdateAgent(agent.id, content);
    },
    [agent.id, onUpdateAgent],
  );

  return (
    <ChatWrapper>
      <Chat
        messages={messages}
        onSendMessage={handleSend}
        placeholder="Update agent instruction..."
      />
    </ChatWrapper>
  );
});
