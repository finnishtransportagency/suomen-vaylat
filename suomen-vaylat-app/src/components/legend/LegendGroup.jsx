import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleDown
} from '@fortawesome/free-solid-svg-icons';

const StyledLegendGroup = styled.div`
`;

const StyledGroupName = styled.p`
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    color: ${props => props.theme.colors.black};
    margin: 0;
    padding-left: 10px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s ease-in;
    @media ${props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledGroupHeader = styled.div`
    z-index: 1;
    position: sticky;
    top: 0px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.hasLegend ? props.theme.colors.maincolor3 : '#bbb'};
    padding-left: 5px;
    border-radius: 2px;
    transition: all 0.1s ease-in;
    &:hover {
        background-color: ${props => props.hasLegend ? props.theme.colors.maincolor2 : '#bbb'};
    };
    &:hover ${StyledGroupName} {
        color: ${props => props.hasLegend ? props.theme.colors.mainWhite : props.theme.colors.black};
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
    border: none;
    margin-right: 15px;
    background-color: transparent;
    svg {
        color: ${props => props.theme.colors.black};
        font-size: 25px;
        transition: all 0.5s ease-out;
    };
`;

const StyledGroupContainer = styled.div`
    height: ${props => props.isOpen ? 'auto' : '0px'};
    overflow: hidden;
    padding: ${props => props.isOpen ? '6px' : '0'};
    margin: 0px 0px 10px 0px;
    border-bottom: 1px solid ${props => props.hasLegend ? props.theme.colors.maincolor3 : '#bbb'};
    border-left: 1px solid ${props => props.hasLegend ? props.theme.colors.maincolor3 : '#bbb'};
    border-right: 1px solid ${props => props.hasLegend ? props.theme.colors.maincolor3 : '#bbb'};
`;

const StyledLegend = styled.div``;

const StyledLegendImage = styled.img``;

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
                    <StyledSelectButton
                        isOpen={isOpen}
                    >
                        <FontAwesomeIcon
                            icon={faAngleDown}
                            style={{
                                transform: isOpen && "rotate(180deg)"
                            }}
                        />
                    </StyledSelectButton>
                </StyledRightContent>
            </StyledGroupHeader>
            <StyledGroupContainer
                isOpen={isOpen}
                key={'legend-conteiner-' + index}
                hasLegend={legend.legend !== null}
            >
                {legend.legend === null &&
                    <StyledLegend>{strings.legend.nolegend}</StyledLegend>
                }
                {legend.legend !== null &&
                    <StyledLegend>
                        <StyledLegendImage
                            src={legend.legend.indexOf('action') > -1 ? process.env.REACT_APP_PROXY_URL + legend.legend + '&t=' + new Date().getTime() : (legend.legend.indexOf('?') > 0 ? legend.legend + '&t=' + new Date().getTime() : legend.legend + '?t=' + new Date().getTime())}
                        ></StyledLegendImage>
                    </StyledLegend>
                }
            </StyledGroupContainer>
        </StyledLegendGroup>
    );
}
