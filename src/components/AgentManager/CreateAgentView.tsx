import { memo, useState, useCallback } from 'react';
import { Chat } from '../Chat';
import type { ChatMessage, ChatTemplate } from '../Chat';
import { ChatWrapper } from './AgentManager.styled';

const TEMPLATES: ChatTemplate[] = [
  { label: 'New Issues', text: 'Alert on new USD investment-grade corporate bond issues with concession above 10bps in Technology and Financials sectors.' },
  { label: 'Spread Monitor', text: 'Monitor OAS spread movements on my watchlist. Alert when any bond widens more than 15bps intraday.' },
  { label: 'Rating Changes', text: 'Track S&P and Moody\'s rating actions on my portfolio bonds. Alert on downgrades and negative outlook changes.' },
  { label: 'Maturity Screener', text: 'Screen for A-rated or better bonds maturing in 2-5 years with yield above 5% and EBITDA coverage above 4x.' },
];

const SYSTEM_MESSAGE: ChatMessage = {
  id: 'system-create',
  role: 'system',
  content: 'Describe what you want this agent to do. Be specific about the bonds, conditions, and thresholds you care about.',
  timestamp: new Date().toISOString(),
};

function buildAgentName(instruction: string): string {
  const words = instruction.split(/\s+/).slice(0, 5).join(' ');
  return words.length > 30 ? words.slice(0, 30) + '...' : words;
}

function buildConfirmationMessage(instruction: string): ChatMessage {
  const name = buildAgentName(instruction);
  return {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content: `Created "${name}" agent. The agent is now active and monitoring.\n\nYou can assign it to a dashboard panel from the agent list.`,
    timestamp: new Date().toISOString(),
  };
}

interface CreateAgentViewProps {
  onCreateAgent: (instruction: string) => void;
}

export const CreateAgentView = memo(function CreateAgentView({
  onCreateAgent,
}: CreateAgentViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([SYSTEM_MESSAGE]);
  const [created, setCreated] = useState(false);

  const handleSend = useCallback(
    (content: string) => {
      if (created) return;
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg, buildConfirmationMessage(content)]);
      onCreateAgent(content);
      setCreated(true);
    },
    [onCreateAgent, created],
  );

  const handleTemplateClick = useCallback(
    (template: ChatTemplate) => {
      if (created) return;
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: template.text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg, buildConfirmationMessage(template.text)]);
      onCreateAgent(template.text);
      setCreated(true);
    },
    [onCreateAgent, created],
  );

  return (
    <ChatWrapper>
      <Chat
        messages={messages}
        onSendMessage={handleSend}
        templates={created ? undefined : TEMPLATES}
        onTemplateClick={created ? undefined : handleTemplateClick}
        placeholder={created ? 'Agent created. Go back to see it in the list.' : 'Describe your agent...'}
        disabled={created}
      />
    </ChatWrapper>
  );
});
