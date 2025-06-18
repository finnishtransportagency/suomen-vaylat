import { useContext, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import {
  faMapMarkedAlt,
  faTimes,
  faExpand,
  faPencilRuler
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import strings from '../../../translations';
import { GFI_GEOMETRY_LAYER_ID } from '../../../utils/constants';

import {
  resetGFILocations,
  removeMarkerRequest,
  setVKMData
} from '../../../state/slices/rpcSlice';

import {
  setIsGfiOpen,
  setMinimizeGfi,
  setMaximizeGfi,
  setActiveSelectionTool
} from '../../../state/slices/uiSlice';

const StyledActionButton = styled(motion.div)`
  max-width: 312px;
  height: 3em;
  padding: 0.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) =>
    props.type === 'gfi'
      ? props.theme.colors.mainColor1
      : props.theme.colors.secondaryColorGreen};
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
  ${({ isExpanded }) =>
    isExpanded &&
    `
        height: auto !important;
    `}
  z-index:100;
`;

const StyledLeftContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const StyledRightContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
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

const StyledGeometryButton = styled.div`
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

const addFeaturesToMapParams = {
  layerId: GFI_GEOMETRY_LAYER_ID,
  featureStyle: {
    fill: {
      color: 'rgba(10, 140, 247, 0.1)'
    },
    stroke: {
      area: {
        color: 'rgba(100, 255, 95, 0.7)',
        width: 4,
        lineJoin: 'round'
      }
    },
    image: {
      shape: 5,
      size: 3,
      fill: {
        color: 'rgba(100, 255, 95, 0.7)'
      }
    }
  }
};

const StyledActionButtonText = styled.div`
  width: 100%;
  margin: 0;
  padding: 0.5em;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: max-height 0.3s ease;

  ${({ isExpanded }) =>
    isExpanded &&
    `
        white-space: normal;
        overflow: visible;
        max-height: none;
        padding: 0.5em;
        background: ${(props) => props.theme.colors.secondaryColorGreen};
        border-radius: 8px;
    `}

  @media ${(props) => props.theme.device.mobileL} {
    font-size: 12px;
  }
`;

const FeatureDataBadge = ({}) => {
  const { store } = useContext(ReactReduxContext);
  const [activeGeometries, setActiveGeometries] = useState(true);

  const { channel, gfiLocations, filteringInfo } = useAppSelector(
    (state) => state.rpc
  );
  
  const { activeTool} = useAppSelector(
    (state) => state.ui
  );

  const handleCloseGFIDialog = () => {
    store.dispatch(setActiveSelectionTool(null));
    store.dispatch(resetGFILocations([]));
    store.dispatch(setIsGfiOpen(false));
    store.dispatch(setVKMData(null));
    store.dispatch(setMinimizeGfi(false));
    store.dispatch(setMaximizeGfi(false));
    setTimeout(() => {
      store.dispatch(setVKMData(null));
    }, 500); // VKM info does not disappear during dialog close animation.
    store.dispatch(removeMarkerRequest({ markerId: 'VKM_MARKER' }));
    channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
      null,
      null,
      'download-tool-layer'
    ]);
    channel &&
      channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        GFI_GEOMETRY_LAYER_ID
      ]);
    activeTool === 'gfi-selection-tool' && channel.postRequest('DrawTools.StopDrawingRequest', [
      'gfi-selection-tool',
      true
    ]);
  };

  const handleShowGeometry = () => {
    if (!activeGeometries) {
      gfiLocations.forEach((gfiLocation) => {
        //tiehaku
        gfiLocation.gfiCroppingArea &&
          channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
            gfiLocation.gfiCroppingArea,
            addFeaturesToMapParams
          ]);
      });
    } else {
      channel &&
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
          null,
          null,
          GFI_GEOMETRY_LAYER_ID
        ]);
    }
    setActiveGeometries(!activeGeometries);
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
    <StyledActionButton
      key="gfi_action_button"
      type="gfi"
      positionTransition
      initial={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
      exit={{ y: 50, filter: 'blur(10px)', opacity: 0 }}
      transition={{
        duration: 0.4,
        type: 'tween'
      }}
    >
      <StyledLeftContent>
        <StyledActionButtonIcon>
          <FontAwesomeIcon icon={faMapMarkedAlt} />
        </StyledActionButtonIcon>
        <StyledActionButtonText>{strings.gfi.title}</StyledActionButtonText>
      </StyledLeftContent>
      <StyledRightContent>
        <StyledGeometryButton onClick={handleShowGeometry}>
          <FontAwesomeIcon icon={faPencilRuler} />
        </StyledGeometryButton>
        <StyledExpandButton
          onClick={() => store.dispatch(setMinimizeGfi(false))}
        >
          <FontAwesomeIcon icon={faExpand} />
        </StyledExpandButton>
        <StyledActionButtonClose onClick={() => handleCloseGFIDialog()}>
          <FontAwesomeIcon icon={faTimes} />
        </StyledActionButtonClose>
      </StyledRightContent>
    </StyledActionButton>
  );
};

export default FeatureDataBadge;
