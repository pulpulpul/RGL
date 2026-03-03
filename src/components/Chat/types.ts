export type ChatMessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: string;
}

export interface ChatTemplate {
  label: string;
  text: string;
}

export interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  templates?: ChatTemplate[];
  onTemplateClick?: (template: ChatTemplate) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
