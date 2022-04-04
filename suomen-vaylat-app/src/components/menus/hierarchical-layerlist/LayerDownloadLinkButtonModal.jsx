import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import styled from "styled-components";
import {Button} from "react-bootstrap";
import strings from "../../../translations";

const StyledFooter = styled.div`
    justify-content: center;
`;

const StyledButton = styled(Button)`
    border-radius: 30px;
    background-color: #0064af;
`;

const StyledSubtitle = styled.div`
    display: flex;
    color: ${props => props.theme.colors.mainColor1};
    padding: 10px 0px 10px 5px;
    font-size: 15px;
`;

const StyledInfoTextContainer = styled.ul`
    li {
        font-size: 14px;
        color: ${props => props.theme.colors.mainColor1};
    }
`;

const StyledContainer = styled.div`
    padding: 24px;
    max-height: 500px;
    min-width: 300px;
    overflow: auto;
`;

export const LayerDownloadLinkButtonModal = ({
                                            downloadLink,
                                            handleIsDownloadLinkModalOpen
                                        }) => {
    return (
        <StyledContainer>
            <StyledSubtitle>{strings.downloadLink.downloadLinkModalNameText}</StyledSubtitle>
            <StyledInfoTextContainer>
                {downloadLink.layerDownloadLinkName}
            </StyledInfoTextContainer>
            <StyledFooter className='modal-footer'>
                <StyledButton onClick={() => window.location.href=downloadLink.layerDownloadLink}>{strings.downloadLink.downloadLinkModalButtonText} <FontAwesomeIcon icon={faDownload} /></StyledButton>
            </StyledFooter>
        </StyledContainer>
    );
};


export default LayerDownloadLinkButtonModal;