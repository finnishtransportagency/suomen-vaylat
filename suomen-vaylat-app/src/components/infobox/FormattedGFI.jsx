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

const StyledInfoHeader = styled.div`
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledInfoHeaderDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: .5rem 0 .5rem 0;
    font-weight: bold;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 19px;
        transition: all 0.3s ease-out;
    };
`;

const StyledLowPriorityDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
`;

const StyledHighPriorityDiv = styled.div`
    margin-left: 1rem;
`;

const StyledLowPriorityTable = styled(motion.div)`
    overflow: hidden;
`;

const StyledFeature = styled(motion.div)`
    overflow: hidden;
`;

const StyledGFITablesContainer  = styled.div`
`;

const reOrderFeatureProperties = (geoJSON = {}, visibleFields = [], highPriority=[]) => {
    if (visibleFields.length === 0 && highPriority.length === 0) {
        return;
    }

    // If visible fields or high priority fields are configured then use them
    geoJSON.features.forEach(f => {
        const reOrderedProperties = {};
        highPriority.forEach(key => {
            if (f.properties[key] !== undefined) {
                reOrderedProperties[key] = f.properties[key];
             }
        });

        visibleFields.forEach(key => {
            if (f.properties[key] !== undefined) {
                reOrderedProperties[key] = f.properties[key];
            }
        });
    });
};

const getContent = (key, value, visibleFields, highPriorityFields, lowPriorityTable, highPriorityTable) => {
    const hasConfiguration = highPriorityFields.length !== 0 || visibleFields.length !== 0;
    value = (value && typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) ? '<a href="' + value + '" target="_blank">' + value + '<a>' : value;
    if (hasConfiguration && highPriorityFields.includes(key)) {
        return highPriorityTable.push(<tr key={'hr-' + key + '-' + value} className="high-priority"><td className="title">{key}</td><td dangerouslySetInnerHTML={{__html: value}}></td></tr>);
    } else if (hasConfiguration && visibleFields.includes(key)) {
        return lowPriorityTable.push(<tr key={'lr-' + key + '-' + value} className="low-priority"><td className="title">{key}</td><td dangerouslySetInnerHTML={{__html: value}}></td></tr>);
    }
    return lowPriorityTable.push(<tr key={'rr-' + key + '-' + value} className="low-priority"><td className="title">{key}</td><td dangerouslySetInnerHTML={{__html: value}}></td></tr>);
};

export const FormattedGFI = ({ data }) => {
    let geoJSON = {...data};
    const visibleFields = JSON.parse(geoJSON.features[0].properties._order.replace('\\',''));
    const highPriority = JSON.parse(geoJSON.features[0].properties._orderHigh.replace('\\',''));
    let pretty = [];

    // reorder properties
    reOrderFeatureProperties(geoJSON, visibleFields, highPriority);

    geoJSON.features.forEach((f, index) => {
        const keys = Object.keys(f.properties);
        let highPriorityTable = [];
        let lowPriorityTable = [];
        keys.forEach(key => {
            if (key !== '_order' && key !== '_orderHigh') {
                getContent(key, f.properties[key], visibleFields, highPriority, lowPriorityTable, highPriorityTable);
            }
        });
        pretty.push(<GFITables key={index} index={index} lowPriorityTable={lowPriorityTable} highPriorityTable={highPriorityTable} />);
    });

    return (
            <>
                <div className='popupContent'>
                    <div className='contentWrapper-infobox'>
                        {pretty.map((table, index) => {
                            return (
                                <div key={'gfi-popup-wrapper-' + index}>
                                    {table}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </>
    );
  };

  const GFITables = ({ index, lowPriorityTable, highPriorityTable}) => {
    const highPriorityTableExists = highPriorityTable.length > 0 ? false : true;
    const [isFeatureOpen, openFeature] = useState(true);
    const [isInfoOpen, openInfo] = useState(highPriorityTableExists);

    return (
            <StyledGFITablesContainer key={'gfi-tables-' + index}>
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
                    <StyledHighPriorityDiv className="high-priority-table">
                        <StyledInfoHeader></StyledInfoHeader>
                        <table>
                            <tbody>
                                {highPriorityTable}
                            </tbody>
                        </table>
                    </StyledHighPriorityDiv>
                :
                    null
                }

                <StyledLowPriorityDiv className="low-priority-table">
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