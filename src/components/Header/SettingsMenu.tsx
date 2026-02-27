import { memo, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import type { RootState } from '../../store/rootReducer';
import type { PersonaCategory } from '../../store/persona/types';
import { SECTORS, CREDIT_RATINGS, TENOR_PREFERENCES } from '../../store/persona/types';
import { togglePersonaItem, setAllPersona, clearAllPersona } from '../../store/persona/actions';

interface SettingsMenuProps {
  onResetLayout: () => void;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
`;

const Panel = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  width: 380px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  background: #1a1a2e;
  border: 1px solid #2a2a3e;
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  z-index: 100;
  padding: 16px;
`;

const ResetButton = styled.button`
  display: block;
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 16px;
  background: none;
  border: 1px solid #2a2a3e;
  border-radius: 6px;
  color: #ccc;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;

  &:hover {
    color: #fff;
    border-color: #444;
    background: #2a2a3e;
  }
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  margin-top: 16px;

  &:first-of-type {
    margin-top: 0;
  }
`;

const SectionLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #c8a632;
`;

const SectionActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionLink = styled.button`
  background: none;
  border: none;
  font-size: 11px;
  color: #c8a632;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #e0c050;
  }
`;

const CheckboxGrid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols}, 1fr);
  gap: 4px 12px;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  cursor: pointer;
  user-select: none;
`;

const Checkbox = styled.span<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid ${(p) => (p.$checked ? '#c8a632' : '#444')};
  border-radius: 3px;
  background: ${(p) => (p.$checked ? 'rgba(200, 166, 50, 0.2)' : 'transparent')};
  flex-shrink: 0;
  transition: border-color 0.15s, background 0.15s;

  &::after {
    content: '${(p) => (p.$checked ? '\\2713' : '')}';
    font-size: 11px;
    color: #c8a632;
  }
`;

const CheckboxLabel = styled.span`
  font-size: 12px;
  color: #ccc;
`;

interface SectionProps {
  label: string;
  category: PersonaCategory;
  options: readonly string[];
  selected: string[];
  cols: number;
  onToggle: (category: PersonaCategory, value: string) => void;
  onAll: (category: PersonaCategory, values: string[]) => void;
  onClear: (category: PersonaCategory) => void;
}

const Section = memo(function Section({
  label,
  category,
  options,
  selected,
  cols,
  onToggle,
  onAll,
  onClear,
}: SectionProps) {
  return (
    <>
      <SectionHeader>
        <SectionLabel>{label}</SectionLabel>
        <SectionActions>
          <ActionLink onClick={() => onAll(category, [...options])}>All</ActionLink>
          <ActionLink onClick={() => onClear(category)}>Clear</ActionLink>
        </SectionActions>
      </SectionHeader>
      <CheckboxGrid $cols={cols}>
        {options.map((opt) => (
          <CheckboxRow key={opt} onClick={() => onToggle(category, opt)}>
            <Checkbox $checked={selected.includes(opt)} />
            <CheckboxLabel>{opt}</CheckboxLabel>
          </CheckboxRow>
        ))}
      </CheckboxGrid>
    </>
  );
});

export const SettingsMenu = memo(function SettingsMenu({
  onResetLayout,
  onClose,
}: SettingsMenuProps) {
  const dispatch = useDispatch();
  const persona = useSelector((state: RootState) => state.persona);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleToggle = useCallback(
    (category: PersonaCategory, value: string) => {
      dispatch(togglePersonaItem(category, value));
    },
    [dispatch],
  );

  const handleAll = useCallback(
    (category: PersonaCategory, values: string[]) => {
      dispatch(setAllPersona(category, values));
    },
    [dispatch],
  );

  const handleClear = useCallback(
    (category: PersonaCategory) => {
      dispatch(clearAllPersona(category));
    },
    [dispatch],
  );

  return (
    <>
      <Overlay onClick={onClose} />
      <Panel ref={menuRef}>
        <ResetButton onClick={onResetLayout}>Reset Layout</ResetButton>
        <Title>Configure Your Trading Persona</Title>
        <Section
          label="Sectors"
          category="sectors"
          options={SECTORS}
          selected={persona.sectors}
          cols={1}
          onToggle={handleToggle}
          onAll={handleAll}
          onClear={handleClear}
        />
        <Section
          label="Credit Ratings"
          category="creditRatings"
          options={CREDIT_RATINGS}
          selected={persona.creditRatings}
          cols={3}
          onToggle={handleToggle}
          onAll={handleAll}
          onClear={handleClear}
        />
        <Section
          label="Tenor Preference"
          category="tenorPreferences"
          options={TENOR_PREFERENCES}
          selected={persona.tenorPreferences}
          cols={1}
          onToggle={handleToggle}
          onAll={handleAll}
          onClear={handleClear}
        />
      </Panel>
    </>
  );
});
