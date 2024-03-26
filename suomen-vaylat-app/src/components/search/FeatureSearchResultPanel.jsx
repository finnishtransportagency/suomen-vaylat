import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import {
    faAngleDown,
    faAngleUp,
    faTimes,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledDropDown = styled(motion.div)`
    z-index: -2;
    //position: absolute;
    top: 0px;
    right: 0px;
    max-width: 400px;
    width: 100%;
    height: auto;
    border-radius: 24px;
    //box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    background-color: ${(props) => props.theme.colors.mainWhite};
    padding: 0px 16px 0px 16px;
    pointer-events: auto;
    overflow: auto;
    @media ${(props) => props.theme.device.mobileL} {
        max-width: 100%;
    } ;
   
`;

const StyledDropdownContentItem = styled.div`
    display: flex;
    flex-direction: row;
    user-select: none;
    cursor: pointer;
    padding: 8px;
    margin-bottom: 8px;
    border: groove;
    border-radius: 5px;
    &:hover {
        background-color: ${(props) => props.theme.colors.hover};
    }
    background-color: ${(props) => props.selected ? props.theme.colors.hover : ''};
    p {
        margin: 0;
        padding: 0;
    }
`;

const StyledWarningContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    user-select: none;
    padding: 8px;
    margin-top: 8px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colors.secondaryColor4};
    color: ${(props) => props.theme.colors.mainWhite};
`;

const StyledDropdownFeatureResultsContainer = styled.div`
    display: flex;
    flex-direction: column;
    user-select: none;
    cursor: pointer;
    border-radius: 5px;
    border-color: ${(props) =>
        props.itemSelected ? props.theme.colors.secondaryColor8 : ''};
    background-color: ${(props) =>
        props.itemSelected ? props.theme.colors.mainColor3 : ''};
`;


const StyledDropdownFeatureResults = styled.div`
    display: flex;
    flex-direction: column;
    user-select: none;
`;

const StyledDropdownContentItemTitle = styled.div`
    margin: 4px 0px 4px 0px;

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;    font-size: 14px;
    color: ${(props) => props.active ? props.theme.colors.secondaryColor8 : '#504d4d'};
`;

const StyledGroupName = styled.div`
  max-width: 220px;
  user-select: none;
  padding-left: 0px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  margin-top: 12px;
  color: ${(props) => props.theme.colors.mainColor1};
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 12px;
  }
`;

const StyledFeatureName = styled.div`
  max-width: 220px;
  user-select: none;
  padding-left: 0px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${(props) => props.theme.colors.mainColor1};
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 12px;
  }
`;

const StyledLayerTitle = styled.div`
  display: flex;
  align-items: center;
`;

const DropdownIcon = styled(FontAwesomeIcon)`
    margin: 18px 0px 12px 8px;
    transform: translateY(-10%);
    cursor: pointer;
    color: ${props => props.theme.colors.mainColor1};
    @media (max-width: 768px) {
        margin-top: 10px;
    }
`;

const StyledWarningIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    svg {
        font-size: 22px;
    }
`;

const StyledCloseButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    cursor: pointer;
    svg {
        font-size: 16px;
    }
`;

const StyledWarningText = styled.div`
    font-size: 14px;
    padding: 0px 4px 0px 8px;
`;

const StyledNoResults = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 8px;
`;

const showFeatureOnMap = (channel, layer, feature) => {
    let geoJson = {...layer.content[0].geojson};
    if (feature !== null) {
        geoJson.features = [feature];
    }

    // empty possible earlier overlays
    channel &&
      channel.postRequest("MapModulePlugin.RemoveFeaturesFromMapRequest", [
        null,
        null,
        "feature-search-results",
      ]);
    
    // add new overlay

    // HUOM tällä zoomataan haluttuun kohteeseen
    if (geoJson !== null) {
      channel &&
        channel.postRequest("MapModulePlugin.AddFeaturesToMapRequest", [
          geoJson,
          {
            layerId: "feature-search-results",
            centerTo: true,
            cursor: "pointer",
            featureStyle: {
              fill: {
                  color: 'rgba(229, 0, 131, 1)',
              },
              stroke: {
                  color: 'rgba(229, 0, 131, 1)',
                  width: 5,
                  lineDash: 'solid',
                  lineCap: 'round',
                  lineJoin: 'round',
                  area: {
                      color: 'rgba(229, 0, 131, 1)',
                      width: 4,
                      lineJoin: 'round'
                  }
              },
              image: {
                  shape: 2,
                  size: 4,
                  fill: {
                      color: 'rgba(229, 0, 131, 1)',
                  }
              }
            },
          },
        ]);
    }
  };

const FeatureSearchResultPanel = ({
    dropdownVariants,
    isMobile,
    setShowSearchResults,
    searchClickedRow,
}) => {
    const { featureSearchResults, searchOn, channel } = useAppSelector((state) => state.rpc);
    const [selectedFeature, setSelectedFeature] = useState('');
    const [openLayer, setOpenLayer] = useState(null);
    const [showWarn, setShowWarn] = useState(false);

    useEffect(() => {
        if (featureSearchResults.length > 0) {
            openLayer !== featureSearchResults[0].layerId && setOpenLayer(featureSearchResults[0].layerId );
            featureSearchResults.filter(layer => layer.limitExceeded).length > 0 && !showWarn && setShowWarn(true);
            showFeatureOnMap(channel, featureSearchResults[0], null);
        }
    }, [featureSearchResults]);

    const handleSetOpenLayer = (layer) => {
        if (openLayer === layer.layerId) {
            setOpenLayer(null);
        } else {
            setOpenLayer(layer.layerId);
            showFeatureOnMap(channel, layer, null);
        }
    }

    return (
        <>
            <StyledDropDown
            key={'dropdown-content-feature'}
            variants={dropdownVariants}
            initial={'initial'}
            animate={'animate'}
            exit={'exit'}
            transition={'transition'}
            >
                { showWarn &&
                    <StyledWarningContainer>
                        
                    <StyledWarningIcon>
                        <FontAwesomeIcon
                                        icon={faTriangleExclamation}
                                    />
                    </StyledWarningIcon>
                    <StyledWarningText>{strings.search.feature.warn}</StyledWarningText>

                        
                    <StyledCloseButton
                        onClick={()=> setShowWarn(false)}
                    >
                        <FontAwesomeIcon
                                        icon={faTimes}
                                    />
                    </StyledCloseButton>
                    </StyledWarningContainer>
                }
                {featureSearchResults.length > 0 && featureSearchResults.map(layer => {
                    return(
                    <>
                        <StyledLayerTitle>
                            <StyledGroupName>{layer.layerName}</StyledGroupName>
                            <DropdownIcon 
                                icon={openLayer === layer.layerId ? faAngleUp : faAngleDown} 
                                onClick={()=> handleSetOpenLayer(layer)}
                            />
                        </StyledLayerTitle>
                            { openLayer === layer.layerId &&
                                <FeatureList layer={layer} isMobile={isMobile} setShowSearchResults={setShowSearchResults} searchClickedRow={searchClickedRow} setSelectedFeature={setSelectedFeature} selectedFeature={selectedFeature}></FeatureList>
                            }

                    </>)
                })
                }
            </StyledDropDown>

        { searchOn === false && featureSearchResults.length === 0 && 
            <StyledNoResults>{strings.search.feature.noResults}</StyledNoResults>
        }
        </>
    );
};

const FeatureList = ({layer, isMobile, setShowSearchResults, searchClickedRow, setSelectedFeature, selectedFeature}) => {
    const { channel } = useAppSelector((state) => state.rpc);

    return(
        <>
        {layer.content[0].geojson.features.map ((feature, index) => {
            return (
                <StyledDropdownContentItem
                    key={"feature_" +index}
                    onClick={() => {
                        isMobile &&
                            setShowSearchResults(false);
                        showFeatureOnMap(channel, layer, feature);
                        selectedFeature === feature.id ? setSelectedFeature('') : setSelectedFeature(feature.id);
                    }}
                    selected={selectedFeature === feature.id ? true : false}
                >
                    <StyledDropdownFeatureResultsContainer>
                        <StyledFeatureName key={"feature_id_" + feature.id}>{feature.id}</StyledFeatureName>
                        <StyledDropdownFeatureResults>

                            {feature.match.map(match =>
                            {
                                const key = Object.keys(match)[0];
                                const value = Object.values(match)[0].toString().slice(0, 25) + (Object.values(match)[0].toString().length > 25 ? "..." : "");
                                return(
                                        <StyledDropdownContentItemTitle active={searchClickedRow === index}>

                                        <b style={{marginRight: '0.5em'}}>{key + ":"}</b><p >{value}</p>
                                        </StyledDropdownContentItemTitle>

                                )
                            }  
                            )}
                        </StyledDropdownFeatureResults>
                        
                    </StyledDropdownFeatureResultsContainer>

                </StyledDropdownContentItem>
            )})
        }
    </>

)}

export default FeatureSearchResultPanel;