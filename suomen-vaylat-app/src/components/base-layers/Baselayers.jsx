import React from 'react';
import { motion } from 'framer-motion';
import '../../custom.scss';
import styled from 'styled-components';
import strings from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../state/hooks';
import Layer from '../menus/hierarchical-layerlist/Layer';


const StyledLegendContainer = styled(motion.div)`
    position: absolute;
    top: 15px;
    right: 100%;
    border-radius: 4px;
    margin-right: 8px;
    height: 100%;
    min-width: 350px;
    max-width: 450px;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    background: ${props => props.theme.colors.mainWhite};
    opacity: 0;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 13px;
        min-width: 80vw;
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

export const Baselayers = ({
    isExpanded,
    setIsExpanded,
    height,
}) => {
    const { allLayers } = useAppSelector((state) => state.rpc);
    const baselayers = allLayers.filter(layer => layer.config?.baseLayer)

    return(
        <StyledLegendContainer
            key={'baselayer-container'}
            height={height}
            animate={isExpanded ? 'visible' : 'hidden'}
            variants={listVariants}
            transition={{
                duration: 0.7,
                type: "tween"
            }}
        >
            <StyledHeaderContent>
                <StyledTitleContent >
                    <p>{strings.tooltips.baseLayersButton}</p>
                </StyledTitleContent>
                    <StyledCloseIcon
                        icon={faTimes}
                        onClick={() => setIsExpanded(false)}
                    />
            </StyledHeaderContent>
            <StyledGroupsContainer id="baselayers-main-container">
                {baselayers.map((layer, index) => {
                    return (
                        <Layer
                            key={layer.id + '_baselayer'}
                            layer={layer} 
                            index={index}
                        />
                )})}
            </StyledGroupsContainer>
        </StyledLegendContainer>
    );
};
