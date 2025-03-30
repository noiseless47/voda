import React from 'react';
import styled from 'styled-components';

const Button = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#b3b3b3'};
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-circular), -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

interface TimeRangeButtonProps {
  $active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TimeRangeButton: React.FC<TimeRangeButtonProps> = ({ $active, onClick, children }) => {
  return (
    <Button $active={$active} onClick={onClick}>
      {children}
    </Button>
  );
};

export default TimeRangeButton; 