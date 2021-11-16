import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../custom.scss';
import styled from 'styled-components';
import strings from '../../translations';
import { LegendGroup } from './LegendGroup';

const StyledLegendContainer = styled.div`
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
    cursor: move;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    padding: .5rem;
`;

const StyledGroupsContainer = styled.div`
    height: calc(100% - 40px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 6px;
`;

export const Legend = ({selectedLayers, hoveringIndex, zoomLevelsLayers, currentZoomLevel}) => {
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

    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
      });
      const updateSize = () =>
        setSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
    useEffect(() => {
        window.onresize = updateSize;
        hoveringIndex !== null ?
            setCurrentLayersInfoLayers(Object.values(zoomLevelsLayers)[hoveringIndex].layers) :
            zoomLevelsLayers[currentZoomLevel] !== undefined && setCurrentLayersInfoLayers(Object.values(zoomLevelsLayers)[currentZoomLevel].layers);
    }, [zoomLevelsLayers, currentZoomLevel, hoveringIndex]);


    return(
        <StyledLegendContainer key={legends}>
            <StyledHeader>
                {strings.legend.title}
            </StyledHeader>
            <StyledGroupsContainer id='legend-main-container'>
                {currentLayersInfoLayers.map((zoomLevelLayer, index) => {
                    const legend = legends.find(layer => layer.layerId === zoomLevelLayer.id);
                    return legend && <LegendGroup
                        key={hoveringIndex !== null ?
                            zoomLevelLayer.id+'_'+hoveringIndex :
                            zoomLevelLayer.id+'_'+currentZoomLevel
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
