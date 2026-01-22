import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import strings from '../../../../translations';

import UserLayersGroup from './subgroups/UserlayersGroup';
import GeometriesGroup from './subgroups/GeometriesGroup';
import ViewsGroup from './subgroups/ViewsGroup';
import { useSelector } from 'react-redux';
import { IS_EXTRANET } from '../../../../utils/appInfoUtil';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';

const masterHeaderIconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 }
};

const listVariants = {
  visible: {
    height: 'auto',
    opacity: 1,
    paddingTop: 8,
    paddingBottom: 0
  },
  hidden: {
    height: 0,
    opacity: 0,
    paddingTop: 0,
    paddingBottom: 0
  }
};

const StyledLayerGroups = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f2f2f2;
  margin: 10px 0px;
  border-radius: 4px;
`;

const StyledMasterGroupHeader = styled.button`
  position: sticky;
  top: -8px;
  z-index: 1;
  min-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.mainColor1};
  border-radius: 4px;
  padding-top: 8px;
  padding-bottom: 8px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border: none;
  width: 100%;
  text-align: left;
  @-moz-document url-prefix() {
    position: initial;
  }
  &:focus {
    outline: 2px solid ${(p) => p.theme.colors.mainColor1Selected};
    outline-offset: 2px;
  }
`;

const StyledLeftContent = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const StyledMasterGroupHeaderIcon = styled.div`
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    font-size: 20px;
    color: ${(props) => props.theme.colors.mainWhite};
  }
  p {
    margin: 0;
    font-weight: bold;
    font-size: 22px;
    color: ${(props) => props.theme.colors.mainWhite};
  }
`;

const StyledMasterGroupTitleContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 9px 0;
`;

const StyledMasterGroupName = styled.p`
  user-select: none;
  max-width: 240px;
  color: ${(props) => props.theme.colors.mainWhite};
  margin: 0;
  padding: 0px;
  font-size: 14px;
  font-weight: 600;
`;

const StyledRightContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledMotionIconWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledMainContent = styled(motion.div)`
  background-color: #f2f2f2;
  padding-left: 8px; /* keep left padding constant so list indentation is stable */
  border-radius: 4px;
  overflow: hidden; /* ensure collapsed content is not visible */
`;

const StyledMainGroupSelectButton = styled.button`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  margin-right: 8px;
  border: none;
  svg {
    color: ${(props) => props.theme.colors.mainWhite};
    font-size: 19px;
    transition: all 0.3s ease-out;
  }
`;

const UserContentGroup = () => {
  
  const title = strings.savedContent?.savedContent;
  const [openMain, setOpenMain] = useState(false);
  const userLayers = useSelector((state) => state.rpc.userLayers) || [];

  // IDs & aria prefixes
  const prefix = 'layerlist-user-content-';
  const headerId = `${prefix}header`;
  const contentId = `${prefix}content`;
  const labelId = `${prefix}label`;
  const toggleBtnId = `${prefix}toggle`;

  const onToggle = () => setOpenMain((s) => !s);
  const onKeyToggle = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <StyledLayerGroups
      role="region"
      aria-roledescription="user content group"
      aria-labelledby={labelId}
    >
      <StyledMasterGroupHeader
        id={headerId}
        aria-expanded={openMain}
        aria-controls={contentId}
        onClick={onToggle}
        onKeyDown={onKeyToggle}
        type="button"
        aria-label={title}
      >
        <StyledLeftContent>
          <StyledMasterGroupHeaderIcon aria-hidden="true">
            <FontAwesomeIcon icon={faFileLines} />
          </StyledMasterGroupHeaderIcon>
          <StyledMasterGroupTitleContent>
            <StyledMasterGroupName id={labelId}>{title}</StyledMasterGroupName>
          </StyledMasterGroupTitleContent>
        </StyledLeftContent>

        <StyledRightContent>
          <StyledMainGroupSelectButton
            id={toggleBtnId}
            aria-label={
              openMain
                ? strings.accessibility?.closeLayerGroup || 'Close layer group'
                : strings.accessibility?.openLayerGroup || 'Open layer group'
            }
            aria-controls={contentId}
            aria-expanded={openMain}
            type="button"
            onClick={(e) => {
              // keep click on icon from bubbling twice (header also toggles)
              e.stopPropagation();
              onToggle();
            }}
          >
            <StyledMotionIconWrapper
              initial="closed"
              animate={openMain ? 'open' : 'closed'}
              variants={masterHeaderIconVariants}
              transition={{
                duration: 0.3,
                type: 'tween'
              }}
              aria-hidden="true"
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </StyledMotionIconWrapper>
          </StyledMainGroupSelectButton>
        </StyledRightContent>
      </StyledMasterGroupHeader>

      <StyledMainContent
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        initial="hidden"
        animate={openMain ? 'visible' : 'hidden'}
        variants={listVariants}
        transition={{ duration: 0.22, type: 'tween' }}
        aria-hidden={!openMain}
        style={{ pointerEvents: openMain ? 'auto' : 'none' }}
      >
        { (IS_EXTRANET || (userLayers && userLayers.length > 0)) &&
          <UserLayersGroup openMain={openMain} />
        }
        <GeometriesGroup openMain={openMain} />
        <ViewsGroup openMain={openMain} />
      </StyledMainContent>
    </StyledLayerGroups>
  );
};

export default UserContentGroup;
