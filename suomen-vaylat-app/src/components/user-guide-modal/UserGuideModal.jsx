import {useContext, useState} from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import suomenVaylatTextIcon from "./images/suomen_vaylat_text.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import { ReactReduxContext } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { setIsUserGuideOpen } from '../../state/slices/uiSlice';
import strings from '../../translations';
import {Accordion} from "react-bootstrap";
import UserGuideTabs from "./UserGuideTabs";
import UserGuideUpperBarContent from "./UserGuideUpperBarContent";
import searchIcon from "./images/haku_ikoni.jpg"
import drawingToolsIcon from "./images/piirtotyökalut.jpg"
import fullScreenIcon from "./images/laajenna_ikoni.jpg"
import zoomBarIcon from "./images/zoom-tasot.jpg"
// import {StyledContainer} from "../search/CommonComponents";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0',
        borderRadius: '4px',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
        border: 'none',
        width: '800px'
    },
    overlay: { zIndex: 20 }
};

const StyledContent = styled.div`
    // max-width: 800px;
    width:400px;
    width: 100%;
    // margin: 100px;
    padding: 32px;
    border-radius: 4px;
`;

// const StyledContainer = styled.div`
//     width: 700px;
// `;

const StyledHeader = styled.div`
    position: sticky;
    top: 0px;
    padding: 16px;
    color: ${props => props.theme.colors.mainWhite};
    background-color: ${props => props.theme.colors.mainColor1};
    height: 56px;
    display: flex;
    align-items: center;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.20);
`;

const StyledModalTitle = styled.p`
    margin: 0;
    font-size: 20px;
    font-weight: bold;
`;

const StyledIcon = styled.img`
    // width: 100%;
    height: 35px;
`;

// const StyledIcon = styled.img`
//     width: 1.3rem;
// `;

const StyledModalCloseIcon = styled.div`
    min-width: 28px;
    min-height: 28px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 20px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
`;

export const UserGuideModal = () => {
    const { store } = useContext(ReactReduxContext);
    const [modalIndex, setModalIndex] = useState(0);
    const isUserGuideOpen = useAppSelector((state) => state.ui.isUserGuideOpen);
    // const content = <div dangerouslySetInnerHTML={{ __html: headingText + '<br><br>' + mainText }}></div>
    const title = strings.appGuide.title

    function closeModal() {
        store.dispatch(setIsUserGuideOpen(false));
    };

    const upperBarContent = <div dangerouslySetInnerHTML={{ __html: '<StyledIcon src={suomenVaylatTextIcon} />' + strings.appGuide.modalContent.upperBar.content.startingView + '<br><br>' +
            strings.appGuide.modalContent.upperBar.content.sharePage + '<br><br>' + strings.appGuide.modalContent.upperBar.content.infoButton + '<br><br>'
    + strings.appGuide.modalContent.upperBar.content.languageSelection }}></div>

    const modalContent = [
        {
            title: strings.appGuide.modalContent.upperBar.title,
            content: <UserGuideUpperBarContent />
        },
        {
            title: strings.appGuide.modalContent.mapLevelMenu.title,
            content: <UserGuideTabs />
        },
        {
            title: strings.appGuide.modalContent.search.title,
            content: <div>
                <StyledIcon src={searchIcon} />
                <p>{strings.appGuide.modalContent.search.content}</p>
            </div>
        },
        {
            title: strings.appGuide.modalContent.measureTool.title,
            content: <div>
                <StyledIcon src={drawingToolsIcon} />
                <p>{strings.appGuide.modalContent.measureTool.content}</p>
            </div>
        },
        {
            title: strings.appGuide.modalContent.setFullScreen.title,
            content: <div>
                <StyledIcon src={fullScreenIcon} />
                <p>{strings.appGuide.modalContent.setFullScreen.content}</p>
            </div>
        },
        {
            title: strings.appGuide.modalContent.zoomBar.title,
            content: <div>
                <StyledIcon src={zoomBarIcon} />
                <p>{strings.appGuide.modalContent.zoomBar.content}</p>
            </div>
        }
    ];

    return (
        // <StyledContainer>
            <Modal
                isOpen={isUserGuideOpen}
                onRequestClose={() => closeModal()}
                style={customStyles}
            >
                <StyledHeader className='modal-header'>
                    <StyledModalTitle>{title}</StyledModalTitle>
                    <StyledModalCloseIcon
                        onClick={() => {
                            closeModal();
                        }} title='Sulje'>
                        <FontAwesomeIcon
                            icon={faTimes}
                        />
                    </StyledModalCloseIcon>
                </StyledHeader>
                <StyledContent>
                    <Accordion activeKey={modalIndex}>
                        {
                        modalContent.map((content, index) => {
                            return (
                                <Accordion.Item
                                    eventKey={index}
                                    bsPrefix={"user-guide-item"}
                                >
                                    <Accordion.Button
                                        // bsPrefix={"accordion-header"}
                                        key={`accordion-header-${index}`}
                                        className={'user-guide-header'}
                                        as={"h4"}
                                        onClick={() => setModalIndex(index)}
                                    >
                                        {content.title}
                                    </Accordion.Button>
                                    <Accordion.Body bsPrefix={'user-guide-body'}>
                                        {content.content}
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        })

                        }
                    </Accordion>
                </StyledContent>
            </Modal>
          // </StyledContainer>
    );
};

export default UserGuideModal;