import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

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
    downloadLink
}) => {

    return (
            <StyledLayerDownloadIconWrapper
                onClick={() => {
                    window.location.href=downloadLink;
                }}
            >
                <FontAwesomeIcon icon={faDownload} />
            </StyledLayerDownloadIconWrapper>
    );
};

export default LayerDownloadLinkButton;