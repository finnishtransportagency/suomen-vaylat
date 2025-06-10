import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledPillButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  background-color: ${({ disabled, color, theme }) =>
    disabled ? '#ccc' : color || theme.colors.button};
  color: ${({ disabled, theme }) =>
    disabled ? '#666' : theme.colors.mainWhite};
  border: none;
  border-radius: 30px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 15px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  width: fit-content;
  transition: background-color 0.2s ease;

  svg,
  img {
    width: 16px !important;
    height: 16px !important;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  }

  @media ${({ theme }) => theme.device.mobileL} {
    font-size: 13px;
    padding: 6px 12px;
    width: 20p svg, img {
      width: 10px !important;
      height: 10px !important;
    }
  }
`;

const ButtonText = styled.span``;

const PillButton = ({
  icon,
  text,
  children,
  onClick,
  disabled,
  color,
  hoverColor
}) => {
  return (
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
      <ButtonText>{children || text}</ButtonText>
    </StyledPillButton>
  );
};

export default PillButton;
