import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import strings from '../../translations';

const StyledLegendContainer = styled.div`
    position:absolute;
    bottom:10px;
    left: 10px;
    z-index:30;
    width: 300px;
    height: 500px;
    background:white;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const StyledHeader = styled.div`
    padding: .5rem;
    background-color: ${props => props.theme.colors.maincolor1};
    color: ${props => props.theme.colors.mainWhite};
    border-radius: 0
`;

export const Legend = ({selectedLayers}) => {
    const allLegends = useAppSelector((state) => state.rpc.legends);
    const legends = [];
    selectedLayers.forEach((layer) => {
        const legend = allLegends.filter((l) => {
            return l.layerId === layer.id;
        });
        if(legend[0]) {
            legends.push(legend);
        }
    });

    console.log(legends);

    return(
        <Draggable>
        <StyledLegendContainer>
            <StyledHeader>{strings.legend.title}</StyledHeader>
        </StyledLegendContainer>
        </Draggable>
    );
};

/*

import Draggable from "react-draggable";
<Draggable>
            <StyledImageDiv>
                <img src={process.env.REACT_APP_PROXY_URL + "action?action_route=GetLayerTile&legend=true&style=digiroad%3Adr_kaistojen_lukumaara&id=901"} alt="kuva"></img>
            </StyledImageDiv>
            </Draggable>
*/