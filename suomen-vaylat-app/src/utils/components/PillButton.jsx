import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledPillButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  background-color: ${(props) =>
    props.disabled ? props.theme.colors.disabledBg : props.color || props.theme.colors.button} !important;
  color: ${(props) =>
    props.disabled ? props.theme.colors.disabledColor : props.theme.colors.mainWhite} !important;
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
    color: ${(props) =>
    props.disabled ? props.theme.colors.disabledColor : props.iconColor || props.theme.colors.mainWhite} !important;
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
  id,
  icon,
  text,
  children,
  onClick,
  disabled,
  color,
  hoverColor,
  iconColor
}) => {
  return (
    <StyledPillButton
      id={`pill-button-${id}`}
      onClick={onClick}
      disabled={disabled}
      color={color}
      hoverColor={hoverColor}
      iconColor={iconColor}
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
