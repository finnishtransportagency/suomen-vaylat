import styled from 'styled-components';
import { motion } from 'framer-motion';
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
  min-width: 0; /* Important for children with ellipsis to allow flex shrinking! */
`;

const StyledTitle = styled.div`
  flex: 1 1 0;
  min-width: 0; /* CRUCIAL for ellipsis truncation in flexbox! */
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
  ...rest
}) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [title]);

  return (
    <StyledBadge
      {...rest}
      bg={bg}
      color={color}
      initial={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
      exit={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      transition={{ duration: 0.4, type: 'tween' }}
      expanded={expanded}
    >
      <StyledLeft>
        {icon}
        <StyledTitle
          expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
          title={title}
        >
          {title}
        </StyledTitle>
      </StyledLeft>
      <StyledRight>
        {actionButtons &&
          actionButtons.map((btn, i) => <span key={i}>{btn}</span>)}
        <StyledCloseButton onClick={closeAction}>
          <FontAwesomeIcon icon={faTimes} />
        </StyledCloseButton>
      </StyledRight>
    </StyledBadge>
  );
};

export default Badge;
