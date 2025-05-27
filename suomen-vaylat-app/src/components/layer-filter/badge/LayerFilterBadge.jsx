import { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import { faTimes, faExpand, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setFilters, setFilteringInfo } from '../../../state/slices/rpcSlice';

import {
  setIsFilterDialogOpen,
  setMinimizeFilterDialog,
  setMaximizeFilterDialog
} from '../../../state/slices/uiSlice';

const StyledFilterActionButton = styled(motion.div)`
  max-width: 312px;
  height: 3em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.colors.secondaryColorPink};
  box-shadow: 2px 2px 4px #0000004d;
  border-radius: 24px;
  color: ${(props) => props.theme.colors.mainWhite};
  pointer-events: auto;
  svg {
    color: ${(props) => props.theme.colors.mainWhite};
  }
  @media ${(props) => props.theme.device.mobileL} {
    top: initial;
    max-width: 212px;
    height: 40px;
  }
  z-index: 100;
`;

const StyledFilterText = styled.div`
  font-size: 14px;
  font-weight: 600;
  user-select: none;
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 12px;
  }
`;

const StyledActionButtonIcon = styled.div`
  min-width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    font-size: 18px;
  }
  @media ${(props) => props.theme.device.mobileL} {
    min-width: 40px;
    height: 40px;
    svg {
      font-size: 16px;
    }
  }
`;

const StyledExpandButton = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    font-size: 20px;
  }
  @media ${(props) => props.theme.device.mobileL} {
    svg {
      font-size: 18px;
    }
  }
`;

const StyledActionButtonClose = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    font-size: 20px;
  }
  @media ${(props) => props.theme.device.mobileL} {
    svg {
      font-size: 18px;
    }
  }
`;

const StyledContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  ${({ isExpanded }) =>
    isExpanded &&
    `
        height: auto;
    `}
`;

const LayerFilterBadge = ({}) => {
  const { store } = useContext(ReactReduxContext);

  const { channel, filteringInfo, filters } = useAppSelector(
    (state) => state.rpc
  );

  const handleCloseFilterDialog = () => {
    // reset map
    filteringInfo.forEach((filteringInfo) => {
      filters.length > 0 &&
        filteringInfo.layer &&
        channel &&
        channel.postRequest('MapModulePlugin.MapLayerUpdateRequest', [
          filteringInfo.layer.id,
          true,
          { CQL_FILTER: null }
        ]);
    });

    // reset states
    store.dispatch(setIsFilterDialogOpen(false));
    store.dispatch(setMinimizeFilterDialog({ minimized: false }));
    store.dispatch(setMaximizeFilterDialog(false));
    store.dispatch(setFilters([]));
    store.dispatch(setFilteringInfo([]));
  };
  // Get titles of filtered layers
  var filterInfoTitle = '';
  filteringInfo.forEach((fil, index) => {
    const title =
      fil.layer.title.length > 10
        ? fil.layer.title.substring(0, 10) + '... '
        : fil.layer.title;
    index === 0
      ? (filterInfoTitle += title)
      : (filterInfoTitle += ', ' + title);
  });

  return (
    <StyledFilterActionButton
      key="filter_action_button"
      positionTransition
      initial={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
      exit={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      transition={{
        duration: 0.4,
        type: 'tween'
      }}
    >
      <StyledContentWrapper>
        <StyledActionButtonIcon>
          <FontAwesomeIcon icon={faFilter} />
        </StyledActionButtonIcon>
        <StyledFilterText>{filterInfoTitle}</StyledFilterText>
        <StyledExpandButton
          onClick={() =>
            store.dispatch(setMinimizeFilterDialog({ minimized: false }))
          }
        >
          <FontAwesomeIcon icon={faExpand} />
        </StyledExpandButton>
        <StyledActionButtonClose onClick={() => handleCloseFilterDialog()}>
          <FontAwesomeIcon icon={faTimes} />
        </StyledActionButtonClose>
      </StyledContentWrapper>
    </StyledFilterActionButton>
  );
};

export default LayerFilterBadge;
