import React from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 *  AI-assisted
 *  Variants:
 * - primary (default): blue background with white text
 * - inverse: white background with blue text
 */

const variantStyles = ({ variant = 'primary', disabled, theme, color, iconColor }) => {
  const primaryBg = color || theme.colors.button;
  const primaryText = theme.colors.mainWhite;
  const primaryBorder = theme.colors.mainColor1;
  const inverseBg = theme.colors.mainWhite;
  const inverseText = theme.colors.mainColor1;
  const disabledBg = theme.colors.disabledBg;
  const disabledText = theme.colors.disabledColor;

  if (disabled) {
    return css`
      background-color: ${disabledBg};
      color: ${disabledText};
      border: 1px solid ${disabledBg};
      svg, img { color: ${disabledText} !important; opacity: 0.5; }
      cursor: not-allowed;
    `;
  }

  switch (variant) {
    case 'inverse':
      return css`
        background-color: ${inverseBg};
        color: ${inverseText};
        border: 1px solid ${primaryBorder};
        svg, img { color: ${iconColor || inverseText} !important; }
        &:hover:enabled {
          background-color: ${(props) =>
            props.hoverColor
              ? props.hoverColor
              : props.theme.colors.hover} !important;
        }
      `;
    case 'primary':
    default:
      return css`
        background-color: ${primaryBg};
        color: ${primaryText};
        border: 1px solid ${primaryBg};
        svg, img { color: ${iconColor || primaryText} !important; }
        &:hover:enabled {
          background-color: ${(props) =>
            props.hoverColor
              ? props.hoverColor
              : props.theme.colors.buttonSelected} !important;
        }
      `;
  }
};

const StyledPillButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  border-radius: 30px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 15px;
  min-height: 38.5px;
  transition: background-color 0.2s ease, outline 0.15s ease;
  pointer-events: auto;

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  ${(props) => variantStyles(props)}

  &:hover:enabled {
    outline: 1px solid ${(props) => props.theme.colors.mainColor2};
  }

  svg,
  img {
    width: 16px;
    height: 16px;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  }

  @media ${({ theme }) => theme.device.mobileL} {
    min-height: 31.5px;
    font-size: 13px;
    padding: 6px 12px;
    svg, img {
      width: 10px;
      height: 10px;
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
  disabled = false,
  color, // optional override for primary bg
  hoverColor,
  iconColor,
  variant = 'primary', // 'primary' | 'inverse'
  ...rest
}) => {
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string' && icon.endsWith('.svg')) {
      return <img src={icon} alt="" aria-hidden="true" />;
    }

    try {
      return <FontAwesomeIcon icon={icon} />;
    } catch (err) {
      console.warn('PillButton: invalid icon prop', icon, err);
      return null;
    }
  };

  return (
    <StyledPillButton
      id={`pill-button-${id}`}
      onClick={onClick}
      disabled={disabled}
      color={color}
      hoverColor={hoverColor}
      iconColor={iconColor}
      variant={variant}
      {...rest}
    >
      {renderIcon()}
      <ButtonText>{children || text}</ButtonText>
    </StyledPillButton>
  );
};

export default PillButton;
