import { useContext } from 'react';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { ReactReduxContext } from "react-redux";
import styled from 'styled-components';
import { useAppSelector } from "../../state/hooks";
import { setIsGFIOpen } from "../../state/slices/uiSlice";
import strings from "../../translations";
import './GFI.scss';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-25%',
        transform: 'translate(-50%, -50%)',
        padding: '0',
        borderRadius: 0,
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
        border: 'none'
    },
    overlay: {zIndex: 20}
};

const StyledContent = styled.div`
    padding: .5rem;
`;

const StyledHeader = styled.div`
    padding: .5rem;
    border-radius: 0;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.maincolor1};
`;

const StyledLayerCloseIcon = styled.div`
    min-width: 28px;
    min-height: 28px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.maincolor2};
        }
    };
`;

export const GFIPopup = props => {
    console.log(props);

    const { store } = useContext(ReactReduxContext);
    const isGFIOpen = useAppSelector((state) => state.ui.isGFIOpen);
    const allLayers = useAppSelector((state) => state.rpc.allLayers);
    console.log(allLayers);
    const headingText = allLayers.filter(layer => layer.id === props.layerId)[0].name;
    console.log(props.content);
    const mainText = props.content;
    const popupContent = <div dangerouslySetInnerHTML={{__html: mainText}}></div> ;
    var contentWrapper = <div className="contentWrapper-infobox">{popupContent}</div> ;
    var contentDiv = <div className="popupContent">{contentWrapper}</div> ;
    const title = strings.gfi.title

    function closeModal() {
        store.dispatch(setIsGFIOpen(false));
    };

    return (
        <div>
            <Modal
                isOpen={isGFIOpen}
                onRequestClose={() => closeModal()}
                style={customStyles}
            >
                <StyledHeader className="modal-header">
                    <h5>{title}</h5>
                    <StyledLayerCloseIcon
                        onClick={() => {
                            closeModal();
                        }} title='Sulje'>
                        <FontAwesomeIcon
                            icon={faTimes}
                        />
                    </StyledLayerCloseIcon>
                </StyledHeader>
                <StyledContent>
                    {headingText}
                    {contentDiv}
                </StyledContent>
            </Modal>
        </div>
    );
};

export default GFIPopup;