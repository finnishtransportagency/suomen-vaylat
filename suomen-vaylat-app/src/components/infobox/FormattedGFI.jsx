import { useState } from "react";
import styled from 'styled-components';
import strings from '../../translations';
import { motion } from 'framer-motion';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const listVariants = {
    visible: {
        height: "auto",
        opacity: 1
    },
    hidden: {
        opacity: 0,
        height: 0,
    },
};

const StyledGFITablesContainer  = styled.div`
    border-bottom: ${props => !props.isFeatureOpen && "1px solid #ddd"};
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

const StyledLowPriorityTable = styled(motion.div)`
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

const getContent = (key, value, visibleFields, highPriorityFields, lowPriorityTable, highPriorityTable) => {
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
        highPriorityTable.push(<tr key={'hr-' + key + '-' + value} className="high-priority"><td className="title">{key}</td><td dangerouslySetInnerHTML={{__html: value}}></td></tr>);
        return;
    } else if (hasConfiguration && visibleFields.includes(key)) {
        lowPriorityTable.push(<tr key={'lr-' + key + '-' + value} className="low-priority"><td className="title">{key}</td><td dangerouslySetInnerHTML={{__html: value}}></td></tr>);
        return;
    }
    lowPriorityTable.push(<tr key={'rr-' + key + '-' + value} className="low-priority"><td className="title">{key}</td><td dangerouslySetInnerHTML={{__html: value}}></td></tr>);
};

export const FormattedGFI = ({ data }) => {
    let geoJSON = {...data};
    const visibleFields = JSON.parse(geoJSON.features[0].properties._order.replace('\\',''));
    const highPriority = JSON.parse(geoJSON.features[0].properties._orderHigh.replace('\\',''));
    let pretty = [];

    geoJSON.features.forEach((f, index) => {
        const keys = Object.keys(f.properties);
        let highPriorityTable = [];
        let lowPriorityTable = [];
        keys.forEach(key => {
            if (key !== '_order' && key !== '_orderHigh') {
                getContent(key, f.properties[key], visibleFields, highPriority, lowPriorityTable, highPriorityTable);
            }
        });
        pretty.push(
            <GFITables
                key={index}
                index={index}
                lowPriorityTable={lowPriorityTable}
                highPriorityTable={highPriorityTable}
                geoJSON={geoJSON}
            />
        );
    });

    return (
            <div className="gri-response-tab">
                {pretty.map((table, index) => {
                    return (
                        <div key={'gfi-popup-wrapper-' + index}>
                            {table}
                        </div>
                    )
                })}
            </div>
    );
  };

  const GFITables = ({
    index,
    lowPriorityTable,
    highPriorityTable
    }) => {
    const highPriorityTableExists = highPriorityTable.length > 0 ? false : true;
    const [isFeatureOpen, openFeature] = useState(true);
    const [isInfoOpen, openInfo] = useState(highPriorityTableExists);

    return (
            <StyledGFITablesContainer
                key={'gfi-tables-' + index}
                isFeatureOpen={isFeatureOpen}
            >
                <StyledInfoHeaderDiv
                    onClick={() => openFeature(!isFeatureOpen)}
                >
                    <StyledInfoHeader>{strings.gfi.target + ' ' + (index + 1)}</StyledInfoHeader>

                    <FontAwesomeIcon
                        icon={faAngleDown}
                        style={{
                            transform: isFeatureOpen && "rotate(180deg)",
                            marginLeft: "0.5rem"
                        }}
                    />
                </StyledInfoHeaderDiv>
                <StyledFeature
                    initial={isFeatureOpen}
                    animate={isFeatureOpen ? "visible" : "hidden"}
                    variants={listVariants}
                    transition={{
                        duration: 0.1,
                    }}
                >

                {!highPriorityTableExists ?
                    <StyledHighPriorityDiv>
                        <table>
                            <tbody>
                                {highPriorityTable}
                            </tbody>
                        </table>
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
                                    transform: isFeatureOpen && "rotate(180deg)",
                                    marginLeft: "0.5rem"
                                }}
                            />
                        </StyledInfoHeaderDiv>
                    :
                        null
                    }
                    <StyledLowPriorityTable
                        initial={isInfoOpen}
                        animate={isInfoOpen ? "visible" : "hidden"}
                        variants={listVariants}
                        transition={{
                            duration: 0.1,
                        }}
                    >
                    <table>
                        <tbody>
                            {lowPriorityTable}
                        </tbody>
                    </table>
                    </StyledLowPriorityTable>
                </StyledLowPriorityDiv>
                </StyledFeature>
            </StyledGFITablesContainer>
    );
  };

export default FormattedGFI;