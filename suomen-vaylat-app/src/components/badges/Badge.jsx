import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const StyledBadge = styled(motion.div)`
  max-width: 312px;
  min-height: 3em;
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
    min-height: 40px;
  }
`;

const StyledLeft = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1em;
`;

const StyledTitle = styled.div`
  max-width: 120px;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  padding: 0.2em 0.6em 0.2em 0;
  ${({ expanded }) =>
    expanded &&
    `
    white-space: normal;
    overflow: visible;
    max-width: none;
    background: ${(props) => props.theme.colors.overlay || '#fff8'};
    border-radius: 5px;
    z-index: 2;
  `}
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 12px;
    max-width: 70px;
  }
`;

const StyledRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1em;
`;

const StyledCloseButton = styled.div`
    font-size: 
    cursor: pointer;
`;

const Badge = ({
  icon,
  title,
  truncateLength = 14,
  bg,
  color,
  actionButtons = [],
  closeAction,
  ...rest
}) => {
  const [expanded, setExpanded] = useState(false);

  // If expanded, show full title, otherwise truncate with ellipsis
  let shownTitle = title;
  if (!expanded && typeof title === 'string' && title.length > truncateLength) {
    shownTitle = title.substring(0, truncateLength) + '...';
  }
  console.log(expanded);

  return (
    <StyledBadge
      {...rest}
      bg={bg}
      color={color}
      initial={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
      exit={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      transition={{ duration: 0.4, type: 'tween' }}
    >
      <StyledLeft>
        {icon}
        <StyledTitle
          expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
          title={title}
        >
          {shownTitle}
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
