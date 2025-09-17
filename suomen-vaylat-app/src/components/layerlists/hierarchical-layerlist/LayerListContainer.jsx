import { useState, useMemo } from 'react';
import store from '../../../state/store';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { useAppSelector } from '../../../state/hooks';
import { motion } from 'framer-motion';
import strings from '../../../translations';
import { setTagLayers, setTags } from '../../../state/slices/rpcSlice';
import Tag from './Tag';
import LayerList, { TagLayerList } from './LayerList';
import LayerSearch from './LayerSearch';
import ReactTooltip from 'react-tooltip';
import { isMobile, theme } from '../../../theme/theme';
import {
  setIsCustomFilterOpen,
  setShowSavedLayers,
  setCheckedLayer,
  setSelectedCustomFilterLayers
} from '../../../state/slices/uiSlice';
import { useSelector } from 'react-redux';
import UserContentGroup from './user-content/UserContentGroup';

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

const StyledLayerGroupWrapper = styled.div``;
const StyledFilterList = styled(motion.div)`
  height: ${(props) => (props.isOpen ? 'auto' : 0)};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${(props) => props.theme.colors.mainColor1};
  margin-bottom: 8px;
`;

const StyledFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledDeleteAllSelectedFilters = styled.div`
  cursor: pointer;
  min-height: 32px;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) => props.theme.colors.mainColor1};
  margin: 16px 0px 16px 0px;
  border-radius: 15px;
  svg {
    font-size: 16px;
  }
  p {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
  }
`;

const StyledSearchAndFilter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledCustomFilterButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  cursor: pointer;
  padding: 0px 6px 0px 6px;
  background-color: ${(props) =>
    props.isSelected
      ? props.theme.colors.mainColor2
      : props.theme.colors.mainWhite};
  margin: 2px;
  border: 1px solid ${(props) => props.theme.colors.mainColor2};
  border-radius: 20px;
  font-size: 13px;
  transition: all 0.1s ease-out;
  color: ${(props) => props.isSelected && props.theme.colors.mainWhite};
  &:hover {
    color: ${(props) => props.theme.colors.mainWhite};
    background-color: ${(props) => props.theme.colors.mainColor3};
  }
`;

const StyledFilterButton = styled.div`
  display: flex;
  padding: 4px 0px 8px 0px;
  justify-content: center;
  align-items: center;
  border-radius: 1px;
  cursor: pointer;
  svg {
    font-size: 18px;
    margin: 5px;
    top: 2px;
    position: relative;
    color: ${(props) => props.theme.colors.mainColor1};
  }
  span {
    color: ${(props) => props.theme.colors.mainColor1};
    white-space: nowrap;
    position: relative;
  }
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.mainColor1};
  margin: 1em 0;
`;

const StyledLayerList = styled.div``;

const SavedLayer = ({ layers, groups }) => {
  const customLayers = localStorage.getItem('checkedLayers');
  const parsedLayers = JSON.parse(customLayers) || [];
  const { tagLayers, tags } = useSelector((state) => state.rpc);
  const layerArray = parsedLayers.map((layer) => layer.id);

  if (parsedLayers.length > 0) {
    return (
      <>
        {(tagLayers.length > 0 || layerArray.length > 0) && (
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
            {layerArray.length > 0 && (
              <TagLayerList
                tag={strings.layerlist.customLayerInfo.customFilter}
                layers={layers}
                groups={groups}
                key={
                  'taglayerlist-' +
                  strings.layerlist.customLayerInfo.customFilter
                }
                customTag={layerArray}
              />
            )}
          </StyledLayerList>
        )}
      </>
    );
  }

  return null;
};

const LayerListContainer = ({ groups, layers, tags }) => {
  useAppSelector((state) => state.language);

  const { showSavedLayers, isCustomFilterOpen } = useAppSelector(
    (state) => state.ui
  );
  const { tagLayers } = useAppSelector((state) => state.rpc);

  const [isOpen, setIsOpen] = useState(false);

  const selectedLayers = localStorage.getItem('checkedLayers');
  const parsedLayers = useMemo(() => {
    return selectedLayers ? JSON.parse(selectedLayers) : [];
  }, [selectedLayers]);

  const emptyFilters = () => {
    store.dispatch(setTagLayers([]));
    store.dispatch(setTags([]));
    store.dispatch(setCheckedLayer([]));
    store.dispatch(setShowSavedLayers(false));
    store.dispatch(setSelectedCustomFilterLayers([]));
  };

  return (
    <>
      <ReactTooltip
        backgroundColor={theme.colors.mainColor1}
        disable={isMobile}
        id="layerlist-filter"
        place="right"
        type="dark"
        effect="float"
      >
        <span>{strings.tooltips.layerlist.filter}</span>
      </ReactTooltip>

      <StyledSearchAndFilter>
        <LayerSearch layers={layers} groups={groups} />
        <StyledFilterButton
          data-tip
          data-for="layerlist-filter"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          isOpen={isOpen}
        >
          <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} />
          <span>{strings.layerlist.layerlistLabels.filterByType}</span>
        </StyledFilterButton>
      </StyledSearchAndFilter>

      <StyledFilterList
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        variants={listVariants}
        transition={{
          duration: 0.3,
          type: 'tween'
        }}
      >
        <StyledFiltersContainer>
          <StyledCustomFilterButton
            isSelected={showSavedLayers}
            onClick={() => {
              if (parsedLayers && parsedLayers.length > 0) {
                store.dispatch(setShowSavedLayers(!showSavedLayers));
              } else {
                store.dispatch(setIsCustomFilterOpen(true));
                store.dispatch(setShowSavedLayers(false));
              }
            }}
          >
            {strings.layerlist.layerlistLabels.createCustomFilter}
          </StyledCustomFilterButton>
          {tags?.map((tag, index) => {
            return <Tag isOpen={isOpen} key={'fiter-tag-' + index} tag={tag} />;
          })}
        </StyledFiltersContainer>
        <StyledDeleteAllSelectedFilters onClick={() => emptyFilters()}>
          <p>{strings.layerlist.layerlistLabels.clearFilters}</p>
        </StyledDeleteAllSelectedFilters>
      </StyledFilterList>

      {showSavedLayers || isCustomFilterOpen ? (
        <SavedLayer layers={layers} />
      ) : (
        <>
          {tagLayers.length === 0 && (
            <>
              <StyledLayerGroupWrapper
                key={'layerlist-container-user-content-group-wrapepr'}
              >
                <UserContentGroup />
              </StyledLayerGroupWrapper>

              <HorizontalLine />
            </>
          )}
          <LayerList
            label={strings.layerlist.layerlistLabels.allLayers}
            groups={groups}
            layers={layers}
            recurse={false}
          />
        </>
      )}
    </>
  );
};

export default LayerListContainer;
