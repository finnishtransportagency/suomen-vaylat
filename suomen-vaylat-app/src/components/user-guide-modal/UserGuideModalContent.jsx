import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { Accordion } from 'react-bootstrap';
import UserGuideTabs from './UserGuideTabs';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserGuideUpperBarContent from './UserGuideUpperBarContent';
import searchIcon from './images/haku_ikoni.jpg';
import drawingToolsIcon from './images/piirtotyökalut.jpg';
import saveViewIcon from './images/tallenna_nakyma.jpg';
import fullScreenIcon from './images/laajenna_ikoni.jpg';
import zoomBarIcon from './images/zoom-tasot.jpg';


const StyledContent = styled.div`
    min-width: 600px;
    max-width: 600px;
    width: 100%;
    height: 100%;
    padding: 16px;
    overflow: auto;
    @media ${props => props.theme.device.mobileL} {
        min-width: initial;
    };
`;

const StyledAccordion = styled(Accordion)`

`;

const StyledAccordionItem = styled(Accordion.Item)`

`;

const StyledAccordionButton = styled(Accordion.Button)`
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-top: 8px;
    p {
        margin: 0;
        margin-left: 8px;
        font-size: 18px;
    };
    svg {
        font-size: 16px;
    }
`;

const StyledAccordionBody = styled(Accordion.Body)`
    padding-top: 16px;
`;

const StyledIcon = styled.img`
    // width: 100%;
    height: 35px;
`;

export const UserGuideModalContent = () => {
    const [modalIndex, setModalIndex] = useState(null);

    const setAccordionIndex = (index) => {
        modalIndex === index ? setModalIndex(null) : setModalIndex(index)
    };

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
            title: strings.appGuide.modalContent.measureTool.title,
            content: <div>
                <StyledIcon src={drawingToolsIcon} />
                <p>{strings.appGuide.modalContent.measureTool.content}</p>
            </div>
        },
        {
            title: strings.appGuide.modalContent.savingView.title,
            content: <div>
                <StyledIcon src={saveViewIcon} />
                <p>{strings.appGuide.modalContent.savingView.content}</p>
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
            title: strings.appGuide.modalContent.search.title,
            content: <div>
                <StyledIcon src={searchIcon} />
                <p>{strings.appGuide.modalContent.search.content}</p>
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
        <StyledContent>
            <StyledAccordion activeKey={modalIndex}>
                {
                    modalContent.map((content, index) => {
                        return (
                            <StyledAccordionItem
                                eventKey={index}
                                //bsPrefix={'user-guide-item'}
                                key={'accordion_' + index}
                            >
                                <StyledAccordionButton
                                    //bsPrefix={'accordion-header'}
                                    //key={`accordion-header-${index}`}
                                    //className={'user-guide-header'}
                                    as={'div'}
                                    onClick={() => setAccordionIndex(index)}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            transform: modalIndex === index && "rotate(90deg)"
                                        }}
                                        icon={faAngleRight}
                                    />
                                    <p>{content.title}</p>
                                </StyledAccordionButton>
                                <StyledAccordionBody bsPrefix={'user-guide-body'}>
                                    {content.content}
                                </StyledAccordionBody>
                            </StyledAccordionItem>
                        )
                    })
                }
            </StyledAccordion>
        </StyledContent>
    );
};

export default UserGuideModalContent;
