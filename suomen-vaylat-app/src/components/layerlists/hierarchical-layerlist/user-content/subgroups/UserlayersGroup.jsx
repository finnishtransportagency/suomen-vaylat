import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import strings from '../../../../../translations';
import UserLayers from '../../../../user-layer/UserLayers';

/* animation variants */
const masterHeaderIconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 }
};

const listVariants = {
  visible: { height: 'auto', opacity: 1 },
  hidden: { height: 0, opacity: 0 }
};

const StyledGroupHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  &:focus {
    outline: 2px solid ${(p) => p.theme.colors.mainColor1Selected};
    outline-offset: 2px;
  }
`;

const StyledLefContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledSelectButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    color: ${(p) => p.theme.colors.mainColor1};
    font-size: 18px;
  }
`;

const StyledGroupName = styled.p`
  max-width: 220px;
  user-select: none;
  margin: 0;
  padding-left: 0;
  font-size: 14px;
  font-weight: bold;
  color: ${(p) => p.theme.colors.mainColor1};
`;

const StyledSubGroupLayersCount = styled.p`
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: ${(p) => p.theme.colors.mainColor1};
`;

const StyledLayerGroup = styled(motion.div)`
  margin: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding: 0 0 0 25px;
`;

const UserLayersGroup = () => {
  const [open, setOpen] = useState(false);
  const userLayers = useSelector((state) => state.rpc.userLayers) || [];

  const prefix = 'layerlist-userlayers-group-';
  const headerId = `${prefix}header`;
  const listId = `${prefix}list`;
  const countId = `${prefix}count`;

  return (
    <>
      <div
        role="region"
        aria-roledescription="user layers group"
        aria-labelledby={headerId}
      >
        <StyledGroupHeader
          id={headerId}
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((s) => !s)}
          type="button"
        >
          <StyledLefContent>
            <StyledSelectButton aria-hidden="true">
              <motion.div
                initial="closed"
                animate={open ? 'open' : 'closed'}
                variants={masterHeaderIconVariants}
                transition={{ duration: 0.22, type: 'tween' }}
              >
                <FontAwesomeIcon icon={faAngleDown} />
              </motion.div>
            </StyledSelectButton>

            <div>
              <StyledGroupName id={`${prefix}label`}>
                {strings.layerlist?.userContent?.userlayers?.title}
              </StyledGroupName>
              <StyledSubGroupLayersCount id={countId}>
                {userLayers.filter((l) => l.visible).length} /{' '}
                {userLayers.length}
              </StyledSubGroupLayersCount>
            </div>
          </StyledLefContent>
        </StyledGroupHeader>

        <StyledLayerGroup
          id={listId}
          aria-labelledby={headerId}
          initial="hidden"
          animate={open ? 'visible' : 'hidden'}
          variants={listVariants}
          transition={{ duration: 0.22, type: 'tween' }}
        >
          <UserLayers
            layers={userLayers}
          />
        </StyledLayerGroup>
      </div>
    </>
  );
};

export default UserLayersGroup;
