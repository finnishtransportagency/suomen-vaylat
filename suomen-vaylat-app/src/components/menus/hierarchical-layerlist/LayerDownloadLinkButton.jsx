import {faDownload} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import React from "react";

const StyledLayerDownloadIconWrapper = styled.div`
    cursor: pointer;
    width: 30px;
    padding-right: 8px;
    font-size: 20px;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
`;

export const LayerDownloadLinkButton = ({
    handleIsDownloadLinkModalOpen
}) => {

    return (
            <StyledLayerDownloadIconWrapper
                onClick={() => handleIsDownloadLinkModalOpen()}
            >
                <FontAwesomeIcon icon={faDownload} />
            </StyledLayerDownloadIconWrapper>
    );
};


export default LayerDownloadLinkButton;