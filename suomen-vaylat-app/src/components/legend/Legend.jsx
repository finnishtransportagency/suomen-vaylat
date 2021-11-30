import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../custom.scss';
import styled from 'styled-components';
import strings from '../../translations';
import { LegendGroup } from './LegendGroup';

const StyledLegendContainer = styled.div`
    border-radius: 4px;
    z-index: 30;
    pointer-events: auto;
    width: 100%;
    height: 100%;
    background:white;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledHeader = styled.div`
    border-radius: 0;
    cursor: auto;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    padding: .5rem;
    border-radius: 4px 4px 0px 0px;
`;

const StyledGroupsContainer = styled.div`
    height: calc(100% - 40px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 6px;
`;

export const Legend = ({selectedLayers, zoomLevelsLayers, currentZoomLevel}) => {
    const legends = [];
    const noLegends = [];
    const allLegends = useSelector((state) => state.rpc.legends);
    const [currentLayersInfoLayers, setCurrentLayersInfoLayers] = useState([]);

    if (selectedLayers) {
        selectedLayers.forEach((layer) => {
            const legend = allLegends.filter((l) => {
                return l.layerId === layer.id;
            });
            if (legend[0] && legend[0].legend) {
                legends.push(legend[0]);
            } else if (legend[0]) {
                noLegends.push(legend[0]);
            }
        });
    }
    legends.push.apply(legends, noLegends);

    useEffect(() => {
            zoomLevelsLayers[currentZoomLevel] !== undefined && setCurrentLayersInfoLayers(Object.values(zoomLevelsLayers)[currentZoomLevel].layers);
    }, [zoomLevelsLayers, currentZoomLevel]);


    return(
        <StyledLegendContainer key={legends}>
            <StyledHeader>
                {strings.legend.title}
            </StyledHeader>
            <StyledGroupsContainer id='legend-main-container'>
                {legends.map((legend, index) => {
                    const zoomLevelLayer = currentLayersInfoLayers.find((layer) => layer.id === legend.layerId);
                    return zoomLevelLayer && <LegendGroup
                        key={currentZoomLevel !== null ?
                            legend.layerId+'_'+currentZoomLevel :
                            legend.layerId+'_'+currentZoomLevel
                        }
                        legend={legend}
                        zoomLevelLayer={zoomLevelLayer}
                        index={index}
                        layer={legend}
                    />
                })}
            </StyledGroupsContainer>
        </StyledLegendContainer>
    );
};
