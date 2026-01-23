import styled from 'styled-components';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const StyledBadge = styled(motion.div)`
  ${({ expanded }) =>
    expanded
      ? `
    min-height: unset;
    `
      : `
    min-height: 3em;
  `}
  max-width: 312px;
  padding: 1em;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.bg};
  box-shadow: 2px 2px 4px #0000004d;
  border-radius: 24px;
  color: ${(props) => props.color || props.theme.colors.mainWhite};
  pointer-events: auto;
  z-index: 100;
  gap: 1em;

  @media ${(props) => props.theme.device.mobileL} {
    max-width: 212px;
    ${({ expanded }) =>
      expanded
        ? `
    min-height: unset;
    `
        : `
        min-height: 40px;
    `}
  }
`;

const StyledLeft = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1em;
  flex: 1 1 auto;
  min-width: 0;
`;

const StyledTitle = styled.div`
  flex: 1 1 0;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ expanded }) =>
    expanded &&
    `
      white-space: normal;
      overflow: visible;
      text-overflow: unset;
    `}
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 12px;
  }
`;

const StyledRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
  flex-shrink: 0;
`;

const StyledCloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  flex-shrink: 0;
`;

const Badge = ({
  icon,
  title,
  bg,
  color,
  actionButtons = [],
  closeAction,
  idPrefix = '',
  ...rest
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [title]);

  const baseId = `${idPrefix}-badge`;
  const titleId = `${baseId}-title`;
  const closeBtnId = `${baseId}-close`;
  const leftId = `${baseId}-left`;
  const rightId = `${baseId}-right`;

  return (
    <StyledBadge
      {...rest}
      bg={bg}
      color={color}
      id={baseId}
      aria-labelledby={titleId}
      aria-expanded={expanded}
      initial={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
      exit={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      transition={{ duration: 0.4, type: 'tween' }}
      expanded={expanded.toString()}
    >
      <StyledLeft id={leftId}>
        {icon && (
          <span
            id={`${baseId}-icon`}
            aria-hidden="true"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {icon}
          </span>
        )}
        <StyledTitle
          id={titleId}
          expanded={expanded}
          tabIndex={0}
          aria-expanded={expanded}
          aria-label={typeof title === 'string' ? title : undefined}
          title={typeof title === 'string' ? title : undefined}
          aria-level={3}
          onClick={() => setExpanded((e) => !e)}
        >
          {title}
        </StyledTitle>
      </StyledLeft>
      <StyledRight id={rightId} role="group" aria-label="Badge actions">
        {actionButtons &&
          actionButtons.map((btn, i) => (
            <span key={i} id={`${baseId}-action-${i}`}>
              {btn}
            </span>
          ))}
        <StyledCloseButton
          id={closeBtnId}
          aria-label="Close badge"
          tabIndex={0}
          onClick={closeAction}
        >
          <FontAwesomeIcon icon={faTimes} />
        </StyledCloseButton>
      </StyledRight>
    </StyledBadge>
  );
};

export default Badge;
