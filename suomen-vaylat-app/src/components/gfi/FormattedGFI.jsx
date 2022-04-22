import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { motion, AnimatePresence } from 'framer-motion';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppSelector } from '../../state/hooks';

const listVariants = {
    visible: {
        height: 'auto',
        opacity: 1
    },
    hidden: {
        opacity: 0,
        height: 0,
    },
};

const StyledGFITablesContainer  = styled(motion.div)`
    border-top: 1px solid #ddd;
    cursor: pointer;
`;

const StyledInfoHeader = styled(motion.div)`
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledInfoHeaderDiv = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px;
    font-weight: bold;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 19px;
        transition: all 0.3s ease-out;
    };
`;

const StyledInfoHeaderIconContainer = styled(motion.div)`

`;

const StyledLowPriorityDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding: 8px;
`;

const StyledHighPriorityDiv = styled.div`
    margin-left: 1rem;
    tbody {
        overflow: auto;
    }
`;

const StyledLowPriorityTableContainer = styled(motion.div)`
    overflow: scroll;
    &::-webkit-scrollbar {
        display: none;
    };
    tbody {
        overflow: auto;
    }
`;

const StyledFeature = styled(motion.div)`
    overflow: hidden;
`;

const StyledGfiTr = styled.tr`
`

const StyledGfiTd = styled.td`
`

const StyledGfiTable = styled.table`
`

const StyledGfiTableBody = styled.tbody`
`

const StyledGfiResponseWrapper = styled.div`
    overflow: auto;
`;

const getContent = (key, value, visibleFields, highPriorityFields, lowPriorityRows, highPriorityRows, generatedKey) => {
    const hasConfiguration = highPriorityFields.length !== 0 || visibleFields.length !== 0;
    value = (value && typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) ? '<a href="' + value + '" target="_blank">' + value + '<a>' : value;

    if (value !== null && typeof value === 'string' && value.trim() === '') {
        return;
    }
    // try if value is JSON
    try {
        const json = JSON.parse(value.replace(/'/g, '"'));
        // if array
        if (Array.isArray(json)) {
            value = '';
            json.forEach(val => {
                value += '<div>' + val + '</div>';
            });
        }
    } catch (err) {
        // not json
    }
    if (hasConfiguration && highPriorityFields.includes(key)) {
        highPriorityRows.push(<StyledGfiTr key={'hr-' + generatedKey + key + '-' + value}><StyledGfiTd>{key}</StyledGfiTd><StyledGfiTd dangerouslySetInnerHTML={{__html: value}}></StyledGfiTd></StyledGfiTr>);
        return;
    } else if (hasConfiguration && visibleFields.includes(key)) {
        lowPriorityRows.push(<StyledGfiTr key={'lr-' + generatedKey + key + '-' + value}><StyledGfiTd>{key}</StyledGfiTd><StyledGfiTd dangerouslySetInnerHTML={{__html: value}}></StyledGfiTd></StyledGfiTr>);
        return;
    }
    lowPriorityRows.push(<StyledGfiTr key={'rr-' + generatedKey + key + '-' + value}><StyledGfiTd>{key}</StyledGfiTd><StyledGfiTd dangerouslySetInnerHTML={{__html: value}}></StyledGfiTd></StyledGfiTr>);

};

export const FormattedGFI = ({ data }) => {
    let geoJSON = {...data};
    let pretty = [];

    const getKey = (properties) => {
        const keys = Object.keys(properties);
        const values = [];
        keys.forEach(key => {
            if (key !== '_order' && key !== '_orderHigh') {
                values.push(key + '_' + properties[key]);
            }
        });
        return values.join('-');
    };

    geoJSON.features.forEach((f, index) => {
        const keys = Object.keys(f.properties);
        let highPriorityRows = [];
        let lowPriorityRows = [];
        const visibleFields = f.properties._order && !Array.isArray(f.properties._order) ? JSON.parse(f.properties._order.replace('\\','')) : f.properties._order && Array.isArray(f.properties._order) ? f.properties._order: [];
        const highPriority = f.properties._orderHigh && !Array.isArray(f.properties._orderHigh) ? JSON.parse(f.properties._orderHigh.replace('\\','')) : f.properties._orderHigh && Array.isArray(f.properties._orderHigh) ? f.properties._orderHigh : [];
        const generatedKey = getKey(f.properties);
        keys.forEach(key => {
            if (key !== '_order' && key !== '_orderHigh' && key !== 'UID') {
                getContent(key, f.properties[key], visibleFields, highPriority, lowPriorityRows, highPriorityRows, generatedKey);
            }
        });

        pretty.push(
            <GFITables
                key={'gfi-table-' + generatedKey}
                index={index}
                lowPriorityRows={lowPriorityRows}
                highPriorityRows={highPriorityRows}
                geoJSON={geoJSON}
                generatedKey={generatedKey}
            />
        );
    });

    return (
            <>
                {pretty.map((table) => {
                    return (
                        <StyledGfiResponseWrapper key={'gfi-popup-wrapper-' + table.key}>
                            {table}
                        </StyledGfiResponseWrapper>
                    )
                })}
            </>
    );
  };

  const GFITables = ({
    index,
    lowPriorityRows,
    highPriorityRows,
    geoJSON,
    generatedKey
    }) => {

    const highPriorityTableExists = highPriorityRows.length > 0 ? false : true;
    const [isFeatureOpen, openFeature] = useState(false);
    const [isInfoOpen, openInfo] = useState(highPriorityTableExists);
    const  [isHovered, setHovered] = useState(false);
    const { channel } = useAppSelector((state) => state.rpc);

    const selectFeature = (feature) => {
        let featureStyle = {
            fill: {
                color: '#e50083',
            },
            stroke: {
                color: '#e50083',
                width: 5,
                lineDash: 'solid',
                lineCap: 'round',
                lineJoin: 'round',
                area: {
                    color: '#e50083',
                    width: 4,
                    lineJoin: 'round'
                }
            },
            image: {
                shape: 5,
                size: 3,
                fill: {
                    color: '#e50083',
                }
            }
        };

        let options = {
            featureStyle: featureStyle,
            layerId: 'gfi-result-layer-overlay',
            animationDuration: 200,
            clearPrevious: true,
        };

        let rn = 'MapModulePlugin.AddFeaturesToMapRequest';

        var geojsonObject = {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'EPSG:3067'
                }
            },
            features: [
                feature
            ]
        };

        channel.postRequest(rn, [geojsonObject, options])};

    const deSelectFeature = () => {
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'gfi-result-layer-overlay']);
    };

    return (
            <StyledGFITablesContainer
                key={'gfi-tables-' + generatedKey}
                onHoverStart={() => {
                    selectFeature(geoJSON.features[index]);
                    setHovered(true);
                }}
                onHoverEnd={() => {
                    deSelectFeature(geoJSON.features[index]);
                    setHovered(false);
                }}
            >
                <StyledInfoHeaderDiv
                    onClick={() => openFeature(!isFeatureOpen)}
                    isFeatureOpen={isFeatureOpen}
                    animate={{
                        backgroundColor: isHovered ? '#f0f0f0' : '#ffffff',
                    }}
                >
                    <StyledInfoHeader
                        animate={{
                            color: isHovered ? '#17a2b8' : '#0064af',
                        }}
                    >{strings.gfi.target + ' ' + (index + 1)}</StyledInfoHeader>
                    <StyledInfoHeaderIconContainer
                        animate={{
                            transform: isFeatureOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faAngleDown}
                        />
                    </StyledInfoHeaderIconContainer>

                </StyledInfoHeaderDiv>
                <AnimatePresence>
                    {
                       isFeatureOpen && <StyledFeature
                            initial={{
                                height: 0,
                                opacity: 0
                            }}
                            animate={{
                                height: 'auto',
                                opacity: 1,
                            }}
                            exit={{
                                height: 0,
                                opacity: 0
                            }}
                            transition={{
                                duration: 0.4,
                                type: "tween"
                            }}
                        >
                            {!highPriorityTableExists ?
                                <StyledHighPriorityDiv>
                                    <StyledGfiTable>
                                        <StyledGfiTableBody>
                                            {highPriorityRows}
                                        </StyledGfiTableBody>
                                    </StyledGfiTable>
                                </StyledHighPriorityDiv>
                            :
                                null
                            }

                            <StyledLowPriorityDiv>
                                {!highPriorityTableExists ?
                                    <StyledInfoHeaderDiv
                                        onClick={() => openInfo(!isInfoOpen)}
                                    >
                                        <StyledInfoHeader>
                                            {strings.gfi.additionalInfo}
                                        </StyledInfoHeader>
                                        <StyledInfoHeaderIconContainer
                                            animate={{
                                                transform: isInfoOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faAngleDown}
                                            />
                                        </StyledInfoHeaderIconContainer>
                                    </StyledInfoHeaderDiv>
                                :
                                    null
                                }
                                <StyledLowPriorityTableContainer
                                    initial={isInfoOpen}
                                    animate={isInfoOpen ? 'visible' : 'hidden'}
                                    variants={listVariants}
                                    transition={{
                                        duration: 0.1,
                                    }}
                                >
                                    <StyledGfiTable>
                                        <StyledGfiTableBody>
                                            {lowPriorityRows}
                                        </StyledGfiTableBody>
                                    </StyledGfiTable>
                                </StyledLowPriorityTableContainer>
                            </StyledLowPriorityDiv>
                        </StyledFeature>
                    }
                </AnimatePresence>
            </StyledGFITablesContainer>
    );
  };

export default FormattedGFI;