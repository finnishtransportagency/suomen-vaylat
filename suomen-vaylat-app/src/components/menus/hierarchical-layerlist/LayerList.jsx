import { useState } from 'react';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import LayerGroup from './LayerGroup';
import Layers from './Layers';

import { motion } from "framer-motion";


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

const StyledLayerList = styled.div`

`;

const StyledLayerGroups = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    //opacity: 0;
    background-color: ${props => props.theme.colors.mainWhite};
    margin: ${props => props.parentId === -1 && "10px 0px 10px 0px"};
    margin-bottom: 10px;
    border-radius: 2px;
    &:last-child {
        ${props => props.parentId === -1 ? '1px solid '+props.theme.colors.mainColor2 : "none"};
    };
`;

const StyledMasterGroupHeader = styled.div`
    position: sticky;
    top: -16px;
    z-index: 1;
    min-height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.mainColor1};
    border-radius: 4px;
    padding-top: 8px;
    padding-bottom: 8px;
`;

const StyledMasterGroupName = styled.p`
    user-select: none;
    max-width: 240px;
    color: ${props => props.theme.colors.mainWhite};
    margin: 0;
    padding: 0px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s ease-in;

    @media ${ props => props.theme.device.mobileL} {
        //font-size: 13px;
    };
`;

const StyledMasterGroupLayersCount = styled.p`
    margin: 0;
    padding: 0px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
`;

const StyledLeftContent = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
`;


const StyledRightContent = styled.div`
    display: flex;
    align-items: center;
`;

const StyledMotionIconWrapper = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledMasterGroupHeaderIcon = styled.div`
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 20px;
        color: ${props => props.theme.colors.mainWhite};
    };
    p {
        margin: 0;
        font-weight: bold;
        font-size: 22px;
        color: ${props => props.theme.colors.mainWhite};
    }
`;


const StyledMasterGroupTitleContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledSelectButton = styled.button`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin-right: 8px;
    border: none;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 19px;
        transition: all 0.3s ease-out;
    };
`;

const StyledLayerGroup = styled(motion.ul)`
    list-style-type: none;
    margin: 0;
    padding-inline-start: 25px;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
`;

export const LayerList = ({
    groups,
    layers,
    recurse = false
}) => {

    const { tagLayers, tags } = useSelector((state) => state.rpc);

    if (tagLayers.length > 0) {
        layers = layers.filter(layer => tagLayers.includes(layer.id));
    };

    return (
        <>
            {tagLayers.length > 0 ?
                <StyledLayerList>
                    {
                        tags.map((tag, index) => {
                            return (
                                <TagLayerList
                                    tag={tag}
                                    layers={layers}
                                    index={index}
                                />
                            );
                        })
                    }
                </StyledLayerList>
                :
                <StyledLayerList>
                    {groups.map((group, index) => {
                        var hasChildren = false;
                        if (group.groups) {
                            hasChildren = group.groups.length > 0;
                        }
                        let isVisible = (group.layers && group.layers.length > 0) || hasChildren;
                        return (
                            <>
                                { isVisible ? (
                                    <LayerGroup
                                        key={group.id}
                                        index={index}
                                        group={group}
                                        layers={layers}
                                        hasChildren={hasChildren}
                                    />) : null}
                            </>
                        );
                    })
                    }
                </StyledLayerList>
            }

        </>
    );
  };

  const TagLayerList = ({
      tag,
      layers,
      index
    }) => {
    const tagsWithLayers = useSelector(state => state.rpc.tagsWithLayers);
    const tagLayers = tagsWithLayers[tag];

    const [ isOpen, setIsOpen ] = useState(false);

    let visibleLayers = [];
    var filteredLayers = [];

    if (tagLayers) {
        tagLayers.forEach((tagLayerId) => {
            var layer = layers.find(layer => layer.id === tagLayerId);
            layer !== undefined && filteredLayers.push(layer);
        });
    };

    filteredLayers.map(layer => {
        layer.visible === true && visibleLayers.push(layer);
        return null;
    });

    return (
            <StyledLayerGroups>
                <StyledMasterGroupHeader
                     key={"smgh_" + index + '_'}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                    <StyledLeftContent>
                        <StyledMasterGroupHeaderIcon>
                            <p>{tag.charAt(0).toUpperCase()}</p>
                        </StyledMasterGroupHeaderIcon>
                        <StyledMasterGroupTitleContent>
                            <StyledMasterGroupName>
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </StyledMasterGroupName>
                            <StyledMasterGroupLayersCount>

                            </StyledMasterGroupLayersCount>
                        </StyledMasterGroupTitleContent>

                    </StyledLeftContent>
                    <StyledRightContent>
                        <StyledSelectButton> 
                            <StyledMotionIconWrapper
                                initial="closed"
                                animate={isOpen ? "open" : "closed"}
                                variants={masterHeaderIconVariants}
                                transition={{
                                    duration: 0.3,
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faAngleDown}
                                />
                            </StyledMotionIconWrapper>
                        </StyledSelectButton>
                    </StyledRightContent>
                </StyledMasterGroupHeader>
                    <StyledLayerGroup
                        key={"slg_" + index + "_"}
                        isOpen={isOpen}
                        initial="hidden"
                        animate={isOpen ? "visible" : "hidden"}
                        variants={listVariants}
                        transition={{
                            duration: 0.3,
                        }}
                    >
                        <Layers layers={filteredLayers} isOpen={isOpen} />
                    </StyledLayerGroup>
            </StyledLayerGroups>
    );
  };

  export default LayerList;