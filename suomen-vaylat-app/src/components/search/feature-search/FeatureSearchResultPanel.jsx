import strings from '../../../translations';
import { useAppSelector } from '../../../state/hooks';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { faAngleDown, faAngleUp, faTimes, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dropdownVariants } from '../utils/SearchUtil';
import { isMobile } from '../../../theme/theme';

const StyledDropDown = styled(motion.div)`
    top: 0px;
    right: 0px;
    max-width: 400px;
    width: 100%;
    height: auto;
    padding: 0 1px;
    background-color: ${(props) => props.theme.colors.mainWhite};
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
    padding: 4px;
    border-bottom: solid;
    border-width: thin;
    :last-child {
      //border: none;
    }
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
    background-color: ${(props) => props.theme.colors.secondaryColorYellow};
    color: ${(props) => props.theme.colors.mainWhite};
`;

const StyledDropdownFeatureResultsContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    user-select: none;
    cursor: pointer;
    border-radius: 5px;
`;


const StyledDropdownFeatureResults = styled.div`
    display: flex;
    flex-direction: column;
    user-select: none;
`;

const StyledDropdownContentItemTitle = styled.div`
    margin: 4px 0px 4px 0px;
    overflow: hidden;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr 2fr;
    font-size: 14px;
`;

const StyledGroupName = styled.div`
  max-width: 220px;
  user-select: none;
  padding-left: 0px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  margin-top: 4px;
  color: ${(props) => props.theme.colors.mainWhite};
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 12px;
  }
`;

const StyledGroupAmount = styled.div`
  max-width: 220px;
  user-select: none;
  padding-left: 0px;
  font-size: 14px;
  font-weight: 600;
  margin: 4px 0 4px 4px;
  color: ${(props) => props.theme.colors.mainWhite};
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 12px;
  }
`;

const StyledLayerTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  border-radius: 5px;
  margin: .5em 0 0 0;
  padding: 0 1em;
  background-color: ${(props) => props.theme.colors.mainColor1};
`;

const DropdownIcon = styled(FontAwesomeIcon)`
    margin-left: 20px;
    transform: translateY(-10%);
    cursor: pointer;
    color: ${props => props.theme.colors.mainWhite};
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

const StyledResultId = styled.div`
    margin-right: 0.5em;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
      white-space: wrap;
      text-overflow: none;
    }
`;

const StyledResultValue = styled.p`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
      white-space: wrap;
      text-overflow: none;
    }
`;

const StyledShowMoreButtonWrapper = styled.div`
    text-align: center;
    margin-top: 1em;
`;

const StyledShowMoreButton = styled.button`
    width: 250px;
    height: 35px;
    color: ${(props) => props.theme.colors.mainWhite};
    background-color: ${(props) => props.theme.colors.mainColor1};
    border-radius: 20px;
    box-shadow: 0px 1px 3px #0000001f;
    border: none;
`;

const StyledTitleWrapper = styled.div`
    display: flex;
`;

// Function to handle displaying a feature on the map
const showFeatureOnMap = (channel, layer, feature) => {
    const geoJson = feature
        ? { ...layer.content.geojson, features: [feature] }
        : { ...layer.content.geojson };

    channel?.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
        null,
        null,
        'feature-search-results',
    ]);

    if (geoJson) {
        channel?.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [
            geoJson,
            {
                layerId: 'feature-search-results',
                centerTo: true,
                maxZoomLevel: 13,
                cursor: 'pointer',
                featureStyle: {
                    fill: { color: 'rgba(229, 0, 131, 1)' },
                    stroke: {
                        color: 'rgba(229, 0, 131, 1)',
                        width: 5,
                        lineDash: 'solid',
                        lineJoin: 'round',
                    },
                    image: {
                        shape: 2,
                        size: 5,
                        fill: { color: 'rgba(229, 0, 131, 1)' },
                    },
                },
            },
        ]);
    }
};

// Feature Search Result Panel Component
const FeatureSearchResultPanel = ({
    lastSearchValue,
    handleFeatureSearch,
}) => {
    const { featureSearchResults, searchOn, channel } = useAppSelector((state) => state.rpc);
    const [selectedFeature, setSelectedFeature] = useState('');
    const [openAttribute, setOpenAttribute] = useState(null);
    const [showWarn, setShowWarn] = useState(false);

    // Effect to handle warnings and map display
    useEffect(() => {
        const hasFeatures = featureSearchResults?.[0]?.content?.geojson?.matchedFeatures;

        if (hasFeatures) {
            if (featureSearchResults.some((layer) => layer.limitExceeded) && !showWarn) {
                setShowWarn(true);
            }
            showFeatureOnMap(channel, featureSearchResults[0], null);
        } else {
            setShowWarn(false);
        }
    }, [featureSearchResults]);

    // Toggle feature details and show them on the map
    const handleSetOpenMatchKey = (layer, matchedKey) => {
        setOpenAttribute(openAttribute === matchedKey ? null : matchedKey);
        setSelectedFeature('');
        showFeatureOnMap(channel, layer, null);
    };

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
                {showWarn && (
                    <StyledWarningContainer>
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                        <StyledWarningText>{strings.search.feature.warn}</StyledWarningText>
                        <StyledCloseButton onClick={() => setShowWarn(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </StyledCloseButton>
                    </StyledWarningContainer>
                )}

                {featureSearchResults.length > 0 && featureSearchResults[0]?.content?.geojson?.matchedFeatures &&
                    Object.keys(featureSearchResults[0].content.geojson.matchedFeatures).map((matchedKey, index) => (
                        <div key={`${matchedKey}-${index}`}>
                            <StyledLayerTitleWrapper onClick={() => handleSetOpenMatchKey(featureSearchResults[0], matchedKey)}>
                                <StyledTitleWrapper>
                                    <StyledGroupName>{matchedKey}</StyledGroupName>
                                    <StyledGroupAmount>
                                        {`(${featureSearchResults[0].content.geojson.matchedFeatures[matchedKey].length})`}
                                    </StyledGroupAmount>
                                </StyledTitleWrapper>
                                <DropdownIcon icon={openAttribute === matchedKey ? faAngleUp : faAngleDown} />
                            </StyledLayerTitleWrapper>
                            {openAttribute === matchedKey && (
                                <FeatureList
                                    channel={channel}
                                    layer={featureSearchResults[0]}
                                    matchedKey={matchedKey}
                                    isMobile={isMobile}
                                    setSelectedFeature={setSelectedFeature}
                                    selectedFeature={selectedFeature}
                                />
                            )}
                        </div>
                    ))}
            </StyledDropDown>

            {featureSearchResults.length > 0 && featureSearchResults[0]?.content?.moreFeatures && (
                <StyledShowMoreButtonWrapper>
                    <StyledShowMoreButton onClick={() => handleFeatureSearch(lastSearchValue, featureSearchResults[0].content.nextStartIndex, featureSearchResults[0].content.layerId)}>
                        {strings.gfi.getMoreFeatures}
                    </StyledShowMoreButton>
                </StyledShowMoreButtonWrapper>
            )}

            {lastSearchValue.length > 0 &&
                !searchOn &&
                featureSearchResults[0]?.content?.geojson?.matchedFeatures &&
                Object.keys(featureSearchResults[0].content.geojson.matchedFeatures).length === 0 && (
                    <StyledNoResults>{strings.search.feature.noResults}</StyledNoResults>
                )}
        </>
    );
};

// FeatureList Component to display matched features
const FeatureList = ({
    channel,
    layer,
    matchedKey,
    setSelectedFeature,
    selectedFeature,
}) => {
    return (
        <StyledDropdownFeatureResults>
            {layer.content.geojson.matchedFeatures[matchedKey].map((item, i) => {
                const actualFeature = layer.content.geojson.features.find(f => f.id === item.feature_id);

                return (
                    <StyledDropdownContentItem
                        key={`search-result-feature-${i}`}
                        selected={selectedFeature === item.feature_id}
                        onClick={() => {
                            showFeatureOnMap(channel, layer, actualFeature);
                            selectedFeature === item.feature_id
                                ? setSelectedFeature('')
                                : setSelectedFeature(item.feature_id);
                        }}
                    >
                        <StyledDropdownFeatureResultsContainer>
                            <StyledDropdownFeatureResults>
                                <StyledDropdownContentItemTitle>
                                    <StyledResultId>{`${item.feature_id}:`}</StyledResultId>
                                    <StyledResultValue>{item.value}</StyledResultValue>
                                </StyledDropdownContentItemTitle>
                            </StyledDropdownFeatureResults>
                        </StyledDropdownFeatureResultsContainer>
                    </StyledDropdownContentItem>
                );
            })}
        </StyledDropdownFeatureResults>
    );
};


export default FeatureSearchResultPanel;
