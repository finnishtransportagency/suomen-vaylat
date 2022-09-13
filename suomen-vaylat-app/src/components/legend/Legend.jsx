import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import '../../custom.scss';
import styled from 'styled-components';
import strings from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { LegendGroup } from './LegendGroup';
import {theme, isMobile} from "../../theme/theme";
import ReactTooltip from "react-tooltip";


const StyledLegendContainer = styled(motion.div)`
    position: absolute;
    top: 0px;
    right: 100%;
    //right: 66px;
    width: 100vw;
    border-radius: 4px;
    //min-width: 200px;
    margin-right: 8px;
    height: 100%;
    max-width: 300px;
    max-height: ${props => props.height && props.height+"px"};
    display: flex;
    flex-direction: column;
    background: ${props => props.theme.colors.mainWhite};
    opacity: 0;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    @media ${ props => props.theme.device.mobileL} {
        //position: unset;
        font-size: 13px;
        right: 42px;
        max-width: calc(100vw - 70px);
    };
`;

const StyledHeaderContent = styled.div`
    height: 56px;
    z-index: 1;
    display: flex;
    border-radius: 4px 4px 0px 0px;
    align-items: center;
    justify-content: space-between;
    background-color:  ${props => props.theme.colors.mainColor1};
    padding: 16px;
    box-shadow: 2px 2px 4px 0px rgba(0,0,0,0.20);
    p {
        margin: 0px;
        font-size: 18px;
        font-weight: bold;
        color:  ${props => props.theme.colors.mainWhite};
    };
    svg {
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledTitleContent = styled.div`
    display: flex;
    align-items: center;
    svg {
        font-size: 20px;
        margin-right: 8px;
    }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
    cursor: pointer;
    font-size: 20px;
`;

const StyledGroupsContainer = styled.div`
    overflow-y: scroll;
    padding: 8px 4px 8px 8px;
`;

const listVariants = {
    visible: {
        y: 0,
        opacity: 1,
        pointerEvents: "auto",
        filter: "blur(0px)"
    },
    hidden: {
        y: "100%",
        opacity: 0,
        pointerEvents: "none",
        filter: "blur(10px)"
    },
};

export const Legend = ({
    selectedLayers,
    currentZoomLevel,
    isExpanded,
    setIsExpanded,
    height
}) => {
    const legends = [];
    const noLegends = [];
    const allLegends = useSelector((state) => state.rpc.legends);

    if (selectedLayers) {
        selectedLayers.forEach((layer) => {
            const legend = allLegends.filter((l) => {
                return l.layerId === layer.id;
            });
            const hasVisible = (!isNaN(layer.maxZoomLevel) && !isNaN(layer.minZoomLevel)) ? layer.maxZoomLevel >= currentZoomLevel && layer.minZoomLevel <= currentZoomLevel : true;
            if (legend[0] && legend[0].legend && hasVisible) {
                legends.push(legend[0]);
            } else if (legend[0] && hasVisible) {
                noLegends.push(legend[0]);
            }
        });
    }
    legends.push.apply(legends, noLegends);

    return(
        <StyledLegendContainer
            key={'legend-container'}
            height={height}
            animate={isExpanded ? 'visible' : 'hidden'}
            variants={listVariants}
            transition={{
                duration: 0.7,
                type: "tween"
            }}
        >
            <ReactTooltip backgroundColor={theme.mainColor1} disable={isMobile} id='legendHeader' place='top' type='dark' effect='float'>
                <span>{strings.tooltips.legendHeader}</span>
            </ReactTooltip>
            <StyledHeaderContent
                data-tip data-for="legendHeader"
            >
                <StyledTitleContent>
                    <p>{strings.legend.title}</p>
                </StyledTitleContent>
                    <StyledCloseIcon
                        icon={faTimes}
                        onClick={() => setIsExpanded(false)}
                    />
            </StyledHeaderContent>
            <StyledGroupsContainer id="legend-main-container">
                {legends.map((legend, index) => {
                    return <LegendGroup
                        key={'legend-group-' + legend.layerId}
                        legend={legend}
                    />
                })}
            </StyledGroupsContainer>
        </StyledLegendContainer>
    );
};
