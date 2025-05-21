import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledPillButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  background-color: ${({ disabled, color, theme }) =>
    disabled ? '#ccc' : color || theme.colors.button};
  color: ${({ disabled, theme }) => (disabled ? '#666' : theme.colors.mainWhite)};
  border: none;
  border-radius: 30px;
  padding: 10px 18px;
  font-weight: 600;
  font-size: 15px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  min-width: 200px;
  height: 45px;
  transition: background-color 0.2s ease;
  position: relative;

  svg, img {
    width: 20px;
    height: 20px;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  }

  &:hover {
    background-color: ${({ disabled, hoverColor, theme }) =>
      disabled ? '#ccc' : hoverColor || theme.colors.buttonHover || '#005b9f'};
  }

  @media ${({ theme }) => theme.device.mobileL} {
    min-width: 160px;
    height: 40px;
    font-size: 13px;
    padding: 8px 14px;

    svg, img {
      width: 16px;
      height: 16px;
    }
  }
`;


const PillButton = ({ icon, text, children, onClick, disabled, color, hoverColor }) => (
    <StyledPillButton
      onClick={onClick}
      disabled={disabled}
      color={color}
      hoverColor={hoverColor}
    >
      {typeof icon === 'string' && icon.endsWith('.svg') ? (
        <img src={icon} alt="icon" />
      ) : (
        <FontAwesomeIcon icon={icon} />
      )}
      {children || text}
    </StyledPillButton>
  );
  

export default PillButton;
