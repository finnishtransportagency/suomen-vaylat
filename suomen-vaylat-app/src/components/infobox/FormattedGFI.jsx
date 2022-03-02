import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { motion } from 'framer-motion';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const StyledGFITablesContainer  = styled.div`
    border-bottom: ${props => !props.isFeatureOpen && '1px solid #ddd'};
    padding: 8px;
`;

const StyledInfoHeader = styled.div`
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledInfoHeaderDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 8px;
    font-weight: bold;
    cursor: pointer;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 19px;
        transition: all 0.3s ease-out;
    };
    &:hover {
        ${StyledInfoHeader}{
            color: ${props => props.theme.colors.mainColor2};
        };
        svg {
            color: ${props => props.theme.colors.mainColor2};
        };
    }
`;

const StyledLowPriorityDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin-left:8px;
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
    margin-left: 8px;
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

const StyledGfiResponseTab = styled.div`
`;

const StyledGfiResponseWrapper = styled.div`
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
    const visibleFields = JSON.parse(geoJSON.features[0].properties._order.replace('\\',''));
    const highPriority = JSON.parse(geoJSON.features[0].properties._orderHigh.replace('\\',''));
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
        const generatedKey = getKey(f.properties);
        keys.forEach(key => {
            if (key !== '_order' && key !== '_orderHigh') {
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
            <StyledGfiResponseTab>
                {pretty.map((table) => {
                    return (
                        <StyledGfiResponseWrapper key={'gfi-popup-wrapper-' + table.key}>
                            {table}
                        </StyledGfiResponseWrapper>
                    )
                })}
            </StyledGfiResponseTab>
    );
  };

  const GFITables = ({
    index,
    lowPriorityRows,
    highPriorityRows,
    generatedKey
    }) => {
    const highPriorityTableExists = highPriorityRows.length > 0 ? false : true;
    const [isFeatureOpen, openFeature] = useState(true);
    const [isInfoOpen, openInfo] = useState(highPriorityTableExists);

    return (
            <StyledGFITablesContainer
                key={'gfi-tables-' + generatedKey}
                isFeatureOpen={isFeatureOpen}
            >
                <StyledInfoHeaderDiv
                    onClick={() => openFeature(!isFeatureOpen)}
                >
                    <StyledInfoHeader>{strings.gfi.target + ' ' + (index + 1)}</StyledInfoHeader>

                    <FontAwesomeIcon
                        icon={faAngleDown}
                        style={{
                            transform: isFeatureOpen && 'rotate(180deg)',
                            marginLeft: '0.5rem'
                        }}
                    />
                </StyledInfoHeaderDiv>
                <StyledFeature
                    initial={isFeatureOpen}
                    animate={isFeatureOpen ? 'visible' : 'hidden'}
                    variants={listVariants}
                    transition={{
                        duration: 0.1,
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

                            <FontAwesomeIcon
                                icon={faAngleDown}
                                style={{
                                    transform: isInfoOpen && 'rotate(180deg)',
                                    marginLeft: '0.5rem'
                                }}
                            />
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
            </StyledGFITablesContainer>
    );
  };

export default FormattedGFI;