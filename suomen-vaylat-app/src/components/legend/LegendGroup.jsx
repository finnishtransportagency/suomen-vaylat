import { useState } from 'react';
import { motion } from 'framer-motion';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import strings from '../../translations';

const StyledLegendGroup = styled.div`
`;

const StyledGroupHeader = styled.div`
    z-index: 1;
    position: sticky;
    top: 0px;
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.hasLegend ? props.theme.colors.mainColor1 : '#bbb'};
    border-radius: 4px;
    transition: all 0.1s ease-in;
    padding: 8px;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
`;

const StyledGroupName = styled.p`
    user-select: none;
    max-width: 200px;
    color: ${props => props.theme.colors.mainWhite};
    margin: 0;
    padding-left: 8px;
    font-size: 14px;
    font-weight: 600;
    @media ${props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledLeftContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledSelectButton = styled.button`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    svg {
        color: ${props => props.subGroup ? props.theme.colors.mainColor1 : props.theme.colors.mainWhite};
        font-size: 19px;
        transition: all 0.3s ease-out;
    };
`;

const StyledMotionIconWrapper = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledGroupContainer = styled(motion.div)`
    overflow: hidden;
    margin-bottom: 6px;
`;

const StyledLegend = styled.div`
    padding: 8px 0px 8px 8px;
`;

const StyledLegendImage = styled.img``;

const masterHeaderIconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
};

const listVariants = {
    visible: {
        height: "auto",
        opacity: 1
    },
    hidden: {
        height: 0,
        opacity: 0
    },
};


export const LegendGroup = ({ legend, index }) => {

    const [isOpen, setIsOpen] = useState(true);
    return (
        <StyledLegendGroup key={'legend-' + index}>
            <StyledGroupHeader
                onClick={() => setIsOpen(!isOpen)}
                key={'legend-header-' + index}
                hasLegend={legend.legend !== null}
            >
                <StyledLeftContent>
                    <StyledGroupName>{legend.layerName}</StyledGroupName>
                </StyledLeftContent>
                <StyledRightContent>
                    <StyledSelectButton>
                            <StyledMotionIconWrapper
                                initial="open"
                                animate={isOpen ? "open" : "closed"}
                                variants={masterHeaderIconVariants}
                                transition={{
                                    duration: 0.3,
                                    type: "tween"
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faAngleDown}
                                />
                            </StyledMotionIconWrapper>
                        </StyledSelectButton>


                </StyledRightContent>
            </StyledGroupHeader>
            <StyledGroupContainer
                isOpen={isOpen}
                key={'legend-conteiner-' + index}
                hasLegend={legend.legend !== null}
                initial="visible"
                animate={isOpen ? "visible" : "hidden"}
                variants={listVariants}
                transition={{
                    duration: 0.3,
                    type: "tween"
                }}
            >
                {legend.legend === null &&
                    <StyledLegend>{strings.legend.nolegend}</StyledLegend>
                }
                {legend.legend !== null &&
                    <StyledLegend>
                        <StyledLegendImage key={legend.legend}
                            src={legend.legend.indexOf('action') > -1 ? process.env.REACT_APP_PROXY_URL + legend.legend : (legend.legend.indexOf('?') > 0 ? legend.legend : legend.legend )}
                        ></StyledLegendImage>
                    </StyledLegend>
                }
            </StyledGroupContainer>
        </StyledLegendGroup>
    );
}
