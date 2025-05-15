import { useState } from 'react';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { setIsCustomFilterOpen } from '../../../state/slices/uiSlice';
import styled from 'styled-components';
import store from '../../../state/store';

import LayerGroup from './LayerGroup';
import Layers from './Layers';

import { motion } from 'framer-motion';
import strings from '../../../translations';

const masterHeaderIconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 }
};

const listVariants = {
  visible: {
    height: 'auto',
    opacity: 1
  },
  hidden: {
    height: 0,
    opacity: 0
  }
};

const StyledLayerList = styled.div``;

const StyledLayerGroups = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.mainWhite};
  margin: ${(props) => props.parentId === -1 && '10px 0px 10px 0px'};
  border-radius: 2px;
  &:last-child {
    ${(props) =>
      props.parentId === -1
        ? '1px solid ' + props.theme.colors.mainColor2
        : 'none'};
  }
`;

const StyledMasterGroupHeader = styled.div`
  position: sticky;
  top: -16px;
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
  @-moz-document url-prefix() {
    position: initial;
  }
`;

const StyledMasterGroupName = styled.p`
  user-select: none;
  max-width: 240px;
  color: ${(props) => props.theme.colors.mainWhite};
  margin: 0;
  padding: 0px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.1s ease-in;

  @media ${(props) => props.theme.device.mobileL} {
    //font-size: 13px;
  }
`;

const StyledMasterGroupLayersCount = styled.p`
  margin: 0;
  padding: 0px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const StyledLeftContent = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
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
`;

const StyledSelectButton = styled.button`
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

const StyledLayerGroup = styled(motion.div)`
  margin: 0;
  padding-inline-start: 8px;
  padding: 4px 0px;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
`;

const StyledLayerGroupWrapper = styled.div``;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
  align-items: center;
  margin: 20px 0px;
  gap: 30px;
`;

const StyledSaveButton = styled.div`
  width: 78px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background-color: ${(props) =>
    props.isOpen ? '#004477' : props.theme.colors.mainColor1};
  cursor: pointer;
  font-size: 13px;
  color: #fff;
`;

const LayerList = ({ groups, layers, recurse = false }) => {
  const { tagLayers, tags } = useSelector((state) => state.rpc);

  // const slicedGroups = groups ? groups.slice() : [];
  const slicedGroups = groups.slice();

  const currentLang = strings.getLanguage();

  const sortedGroups =
    slicedGroups.length > 0
      ? slicedGroups.sort(function (a, b) {
          const aName =
            a.locale[currentLang] && a.locale[currentLang].name
              ? a.locale[currentLang].name
              : null;
          const bName =
            b.locale[currentLang] && b.locale[currentLang].name
              ? b.locale[currentLang].name
              : null;

          // b.id 727 is Tierekisteri (Poistuva) and should be the lowest element on the list
          if (b.id === 727) {
            return -1;
          }
          // a.id 727 is Tierekisteri (Poistuva) only on Firefox
          else if (a.id === 727) {
            return 1;
          } else if (aName && bName) {
            return aName.toLowerCase().localeCompare(bName.toLowerCase());
          } else {
            return 0;
          }
        })
      : [];

  if (tagLayers.length > 0) {
    layers = layers.filter((layer) => tagLayers.includes(layer.id));
  }

  return (
    <>
      {tagLayers.length > 0 ? (
        <StyledLayerList>
          {tags.map((tag, index) => {
            return (
              <TagLayerList
                tag={tag}
                layers={layers}
                index={index}
                groups={groups}
                key={'taglayerlist-' + tag + '-' + index}
              />
            );
          })}
        </StyledLayerList>
      ) : (
        <StyledLayerList>
          {sortedGroups.map((group, index) => {
            const recursiveCheckSubGroupLayers = (group) => {
              var hasChildrenLayers = false;
              if (group.layers && group.layers.length) {
                hasChildrenLayers = true;
              } else if (group.groups && group.groups.length > 0) {
                group.groups.forEach((subgroup) => {
                  const hasLayers = recursiveCheckSubGroupLayers(subgroup);
                  if (hasLayers === true) {
                    hasChildrenLayers = true;
                  }
                });
              }
              return hasChildrenLayers;
            };

            var hasChildren = recursiveCheckSubGroupLayers(group);
            let isVisible =
              (group.layers && group.layers.length > 0) || hasChildren;
            return (
              group.id !== 826 && (
                <StyledLayerGroupWrapper key={'group-sl-' + group.id}>
                  {isVisible ? (
                    <LayerGroup
                      key={'layer-group-' + group.id}
                      group={group}
                      layers={layers}
                      hasChildren={hasChildren}
                    />
                  ) : null}
                </StyledLayerGroupWrapper>
              )
            );
          })}
        </StyledLayerList>
      )}
    </>
  );
};

export const TagLayerList = ({
  tag,
  layers,
  index,
  groups,
  customTag = []
}) => {
  const tagsWithLayers = useSelector((state) => state.rpc.tagsWithLayers);
  const [isOpen, setIsOpen] = useState(customTag.length > 0);
  let tagLayers = customTag;
  if (tagLayers.length === 0) {
    tagLayers = tagsWithLayers[tag];
  }

  let visibleLayers = [];
  var filteredLayers = [];

  if (tagLayers) {
    tagLayers.forEach((tagLayerId) => {
      var layer = layers.find((layer) => layer.id === tagLayerId);
      layer !== undefined && filteredLayers.push(layer);
    });
  }

  filteredLayers.map((layer) => {
    layer.visible === true && visibleLayers.push(layer);
    return null;
  });

  return (
    <StyledLayerGroups>
      <StyledMasterGroupHeader
        aria-label={
          isOpen
            ? strings.accessibility.closeLayerGroup
            : strings.accessibility.openLayerGroup
        }
        key={'smgh_' + index + '_'}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <StyledLeftContent>
          <StyledMasterGroupHeaderIcon>
            <p>{tag.charAt(0).toUpperCase()}</p>
          </StyledMasterGroupHeaderIcon>
          <StyledMasterGroupTitleContent>
            <StyledMasterGroupName>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </StyledMasterGroupName>
            <StyledMasterGroupLayersCount></StyledMasterGroupLayersCount>
          </StyledMasterGroupTitleContent>
        </StyledLeftContent>
        <StyledRightContent>
          <StyledSelectButton
            aria-label={
              isOpen
                ? strings.accessibility.closeLayerGroup
                : strings.accessibility.openLayerGroup
            }
          >
            <StyledMotionIconWrapper
              initial="closed"
              animate={isOpen ? 'open' : 'closed'}
              variants={masterHeaderIconVariants}
              transition={{
                duration: 0.3,
                type: 'tween'
              }}
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </StyledMotionIconWrapper>
          </StyledSelectButton>
        </StyledRightContent>
      </StyledMasterGroupHeader>
      <StyledLayerGroup
        key={'slg_' + index + '_'}
        isOpen={isOpen}
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        variants={listVariants}
        transition={{
          duration: 0.3,
          type: 'tween'
        }}
      >
        <Layers layers={filteredLayers} groups={groups} />

        { customTag.length > 0 &&
            <StyledButtonContainer>
                <StyledSaveButton
                    onClick={() => {
                    store.dispatch(setIsCustomFilterOpen(true));
                    }}
                >
                    {strings.layerlist.customLayerInfo.editLayers}
                </StyledSaveButton>
            </StyledButtonContainer>
        }
      </StyledLayerGroup>
    </StyledLayerGroups>
  );
};

export default LayerList;
