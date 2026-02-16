import { memo, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface SettingsMenuProps {
  onResetLayout: () => void;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99;
`;

const Menu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  min-width: 180px;
  background: #1e1e2e;
  border: 1px solid #333;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 100;
  overflow: hidden;
`;

const MenuItem = styled.button<{ $disabled?: boolean }>`
  display: block;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  color: ${(p) => (p.$disabled ? '#555' : '#ccc')};
  font-size: 13px;
  text-align: left;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};

  &:hover {
    background: ${(p) => (p.$disabled ? 'none' : '#2a2a3e')};
  }
`;

export const SettingsMenu = memo(function SettingsMenu({
  onResetLayout,
  onClose,
}: SettingsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <>
      <Overlay onClick={onClose} />
      <Menu ref={menuRef}>
        <MenuItem onClick={onResetLayout}>Reset Layout</MenuItem>
        <MenuItem $disabled>Theme</MenuItem>
        <MenuItem $disabled>Filters</MenuItem>
      </Menu>
    </>
  );
});
