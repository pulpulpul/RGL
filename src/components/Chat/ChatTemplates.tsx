import { memo, useCallback } from 'react';
import type { ChatTemplate } from './types';
import { TemplatesRow, TemplatePill } from './Chat.styled';

interface ChatTemplatesProps {
  templates: ChatTemplate[];
  onTemplateClick: (template: ChatTemplate) => void;
}

export const ChatTemplates = memo(function ChatTemplates({
  templates,
  onTemplateClick,
}: ChatTemplatesProps) {
  const handleClick = useCallback(
    (template: ChatTemplate) => () => onTemplateClick(template),
    [onTemplateClick],
  );

  return (
    <TemplatesRow>
      {templates.map((t) => (
        <TemplatePill key={t.label} onClick={handleClick(t)}>
          {t.label}
        </TemplatePill>
      ))}
    </TemplatesRow>
  );
});
