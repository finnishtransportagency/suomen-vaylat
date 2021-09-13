import { useContext, useState, useEffect } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import strings from '../../translations';
import { LegendGroup } from './LegendGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { setIsLegendOpen } from '../../state/slices/uiSlice';


const StyledLegendContainer = styled.div`
    position:absolute;
    bottom:10px;
    right: 10px;
    z-index:30;
    width: 300px;
    max-width:70%;
    height: 60%;
    background:white;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    @media ${ props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledHeader = styled.div`
    padding: .5rem;
    background-color: ${props => props.theme.colors.maincolor1};
    color: ${props => props.theme.colors.mainWhite};
    border-radius: 0
`;

const StyledGroupsContainer = styled.div`
    padding: 6px;
    height: calc(100% - 40px);
    overflow-y: auto;
`;

const StyledLayerCloseIcon = styled.div`
    cursor: pointer;
    position:absolute;
    right: 0;
    top: 8px;
    justify-content: center;
    align-items: center;
    min-width: 28px;
    min-height: 28px;
    svg {
        transition: all 0.1s ease-out;
        font-size: 18px;
        color: ${props => props.theme.colors.mainWhite};
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.maincolor2};
        }
    }
`;

export const Legend = ({selectedLayers}) => {
    useAppSelector((state) => state.rpc.legends);
    const legends = [];
    const noLegends = [];
    const { store } = useContext(ReactReduxContext);
    const allLegends = useAppSelector((state) => state.rpc.legends);

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
      useEffect(() => (window.onresize = updateSize), []);


    return(
        <Draggable handle='.draggable-handler' bounds="parent" disabled={size.width/2 < 300}>
            <StyledLegendContainer>
                <StyledHeader className='draggable-handler'>
                    {strings.legend.title}
                    <StyledLayerCloseIcon
                        className='draggable-cancel'
                        onClick={() => {
                            store.dispatch(setIsLegendOpen(false));
                            }}>
                            <FontAwesomeIcon
                                icon={faTimes}
                            />
                        </StyledLayerCloseIcon>
                </StyledHeader>
                <StyledGroupsContainer>
                {legends && legends.length > 0 && legends.map((legend, index) => {
                    return(
                        <LegendGroup legend={legend} key={'legend-legend-group-' + index} index={index}></LegendGroup>
                    )
                })}
                {legends && legends.length === 0 &&
                    <>{strings.legend.noSelectedLayers}</>
                }
                </StyledGroupsContainer>
            </StyledLegendContainer>
        </Draggable>
    );
};