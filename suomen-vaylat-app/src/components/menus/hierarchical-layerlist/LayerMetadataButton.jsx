import {  useContext } from "react";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { clearLayerMetadata, getLayerMetadata, setLayerMetadata } from '../../../state/slices/rpcSlice';

const StyledLayerInfoIconWrapper = styled.div`
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

export const LayerMetadataButton = ({
    layer
}) => {

    const { store } = useContext(ReactReduxContext);

    const handleMetadataSuccess = (data, layer, uuid) => {
        if (data) {
            store.dispatch(setLayerMetadata({ data: data, layer: layer, uuid: uuid }));
        }
    };

    const handleMetadataError = () => {
        store.dispatch(clearLayerMetadata());
    };

    return (
            <StyledLayerInfoIconWrapper
                uuid={layer.metadataIdentifier}
                onClick={() => {
                    store.dispatch(getLayerMetadata({ layer: layer, uuid: layer.metadataIdentifier, handler: handleMetadataSuccess, errorHandler: handleMetadataError }));
                }}
            >
                <FontAwesomeIcon icon={faInfoCircle} />
            </StyledLayerInfoIconWrapper>
    );
};

export default LayerMetadataButton;