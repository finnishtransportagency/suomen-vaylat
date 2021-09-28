import { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import strings from '../../../translations';
import { ReactReduxContext, useSelector } from 'react-redux';
import { setAllLayers } from '../../../state/slices/rpcSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layers from './Layers';
import {
    faAngleDown,
    faMap
} from '@fortawesome/free-solid-svg-icons';

import Checkbox from '../../checkbox/Checkbox';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const StyledLayerGroups = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: 0;
    animation-delay: ${props => props.index * 0.025 + 's'};
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
    animation-name: ${fadeIn};
    margin: 10px 0px 10px 0px;
    border-radius: 2px;
    background-color: ${props => props.theme.colors.mainWhite};
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.maincolor2 : "none"};
    };
`;

const StyledMasterGroupName = styled.p`
    user-select: none;
    transition: all 0.1s ease-in;
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    padding-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    color: ${props => props.theme.colors.black};
    @media ${ props => props.theme.device.mobileL} {
        font-size: 13px;
    };
`;

const StyledMasterGroupHeader = styled.div`
    z-index: 1;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding-left: 5px;
    transition: all 0.1s ease-in;
    border-radius: 2px;
    background-color: ${props => props.theme.colors.secondaryColor3};
    &:hover {
        background-color: ${props => props.theme.colors.secondaryColor2};
    };
    &:hover ${StyledMasterGroupName} {
        color: ${props => props.theme.colors.mainWhite};
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

const StyledMasterGroupHeaderIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    background-color: ${props => props.theme.colors.secondaryColor2};
    border-radius: 50%;
    svg {
        font-size: 16px;
        color: ${props => props.theme.colors.mainWhite};
    };
`;

const StyledSelectButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border: none;
    background-color: transparent;
    margin-right: 15px;
    svg {
        font-size: 25px;
        transition: all 0.5s ease-out;
        color: ${props => props.theme.colors.black};
    };
`;

const StyledLayerGroupContainer = styled.div`
    height: ${props => props.isOpen ? "auto" : "0px"};
    overflow: hidden;
`;

const StyledLayerGroup = styled.ul`
    padding-inline-start: 10px;
    list-style-type: none;
`;

const StyledSubHeader = styled.p`
    display: flex;
    align-items: center;
    margin: 0px;
    margin-top: 10px;
    padding-left: 5px;
    height: 30px;
    color: ${props => props.theme.colors.secondaryColor3};
    font-size: 12px;
`;

const StyledSubText = styled.p`
    margin: 0px;
    padding: 10px;
    color: ${props => props.theme.colors.black};
    font-size: 12px;
`;


export const ThemeLayerList = ({allLayers, allThemes}) => {
    // const searchParams = useSelector(state => state.ui.searchParams);
    return (
        <>
            {allThemes.map((theme, index) => {
                var filteredLayers = allLayers.filter(layer => theme.layers.includes(layer.id));
                //var searchResults = filteredLayers.filter(layer => layer.name.toLowerCase().includes(searchParams.toLowerCase()));
                   return <ThemeGroup
                        key={index}
                        theme={theme}
                        filteredLayers={filteredLayers}
                        index={index}
                    />
                // return searchParams.length < 2 ? (
                //     <ThemeGroup
                //         key={index}
                //         theme={theme}
                //         filteredLayers={searchParams !== "" ? searchResults : filteredLayers}
                //         index={index}
                //     />
                // ) : searchResults.length > 0 &&  (
                //     <ThemeGroup
                //         key={index}
                //         theme={theme}
                //         filteredLayers={searchParams !== "" ? searchResults : filteredLayers}
                //         index={index}
                //         searchParams={searchParams}
                //     /> 
                // );
            })}
        </>
    );
  };

  export const ThemeGroup = ({theme, filteredLayers, index, searchParams}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { store } = useContext(ReactReduxContext);
    const channel = useSelector(state => state.rpc.channel);

    // useEffect(() => {
    //     searchParams !== undefined && setIsOpen(true);
    // },[searchParams]);

    let checked;
    let indeterminate;
    let visibleLayers = [];

    filteredLayers.map(layer => {
        layer.visible === true && visibleLayers.push(layer);
        return true;
    });

    if (filteredLayers.length === visibleLayers.length) {
        checked = true;
    } else if (visibleLayers.length > 0 ) {
        indeterminate = true;
    } else {
        checked = false;
        indeterminate = false;
    };


    const selectGroup = (e) => {
        e.stopPropagation();
        if (!indeterminate) {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, !layer.visible]);
                return true;
            });
        } else {
            filteredLayers.map(layer => {
                channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [layer.id, false]);
                return true;
            });
        }
        channel.getAllLayers(function (data) {
                store.dispatch(setAllLayers(data));
        });
    };

    return (
            <StyledLayerGroups key={index} index={index}>

                <StyledMasterGroupHeader
                    key={"smgh_" + index}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <StyledLeftContent>
                        <StyledMasterGroupHeaderIcon>
                            <FontAwesomeIcon
                                icon={faMap}
                            />
                        </StyledMasterGroupHeaderIcon>
                        <StyledMasterGroupName>{theme.name}</StyledMasterGroupName>
                    </StyledLeftContent>
                    <StyledRightContent>
                        <Checkbox
                            isChecked={checked}
                            handleClick={selectGroup}
                        />
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
                </StyledMasterGroupHeader>
                <StyledLayerGroupContainer
                    key={"slg_" + index}
                    isOpen={isOpen}
                >
                    <StyledLayerGroup>
                        <StyledSubHeader>VÄLIOTSIKKO</StyledSubHeader>
                        <StyledSubText>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus, necessitatibus adipisci velit, aliquid sunt commodi officiis expedita dolor eligendi natus numquam reiciendis ipsam non facere repellat deserunt blanditiis quam? Dicta!</StyledSubText>
                        <StyledSubHeader>
                            {strings.layerlist.layerlistLabels.layers.toUpperCase()}
                        </StyledSubHeader>
                        <Layers layers={filteredLayers} isOpen={isOpen} theme={theme.name}/>
                    </StyledLayerGroup>
                </StyledLayerGroupContainer>
            </StyledLayerGroups>
    );
  };

  export default ThemeLayerList;