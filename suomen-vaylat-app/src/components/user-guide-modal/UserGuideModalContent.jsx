import { useState } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { Accordion } from 'react-bootstrap';
import UserGuideTabs from './UserGuideTabs';
import {
    faExpand,
    faLayerGroup,
    faSearch,
    faPencilRuler,
    faSave,
    faMapMarkedAlt,
    faDownload,
    faAngleRight,
    faList,
} from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as VaylaLogo } from '../layout/images/vayla_v_white.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserGuideUpperBarContent from './UserGuideUpperBarContent';
import { theme } from '../../theme/theme';


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
    display: flex;
    flex-direction: column;
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

const StyledGuideContent = styled.div`
    margin-left 20px;
`;

const StyledVaylaButton = styled.div`
    border: none;
    border-radius: 50%;
    background: ${theme.colors.mainColor1};
    height: 40px;
    width: 40px;
    pointer-events: none;
    margin-left: 10px;
`;

const StyledIconButton = styled.div`
    border: none;
    border-radius: 50%;
    background: ${theme.colors.mainColor1};
    height: 40px;
    width: 40px;
    pointer-events: none;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledFAIcon = styled(FontAwesomeIcon)`
    color: ${theme.colors.mainWhite};
`;

const StyledTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    user-select: none;
`;

export const UserGuideModalContent = () => {
    const [modalIndex, setModalIndex] = useState(null);

    const setAccordionIndex = (index) => {
        modalIndex === index ? setModalIndex(null) : setModalIndex(index)
    };

    const modalContent = [
        {
            title:  <StyledTitleWrapper>
                    <StyledVaylaButton>
                        <VaylaLogo />
                    </StyledVaylaButton>
                        <p>{strings.appGuide.modalContent.upperBar.title}</p>
                    </StyledTitleWrapper>,
            content: <StyledGuideContent>
                        <UserGuideUpperBarContent />
                    </StyledGuideContent> 
        },
        {
            title: <StyledTitleWrapper>
                        <StyledIconButton>
                            <StyledFAIcon icon={faLayerGroup} />
                        </StyledIconButton>
                        <p>{strings.appGuide.modalContent.mapLevelMenu.title}</p>
                    </StyledTitleWrapper>,
            content: <UserGuideTabs />
        },
        {
            title: <StyledTitleWrapper>
                        <StyledIconButton>
                            <StyledFAIcon icon={faMapMarkedAlt} />
                        </StyledIconButton>
                        <p>{strings.gfi.title}</p>
                    </StyledTitleWrapper>,
            content: <StyledGuideContent style={{display: 'grid', gridTemplateColumns: '1fr'}}>
                        <p>{strings.appGuide.modalContent.gfi.content}</p>
                    </StyledGuideContent>
        },
        {
            title: <StyledTitleWrapper>
                        <StyledIconButton>
                            <StyledFAIcon icon={faDownload} />
                        </StyledIconButton>
                        <p>{strings.downloads.downloads}</p>
                    </StyledTitleWrapper>,
            content: <StyledGuideContent>
                        <p>{strings.appGuide.modalContent.downloads.content}</p>
                    </StyledGuideContent>
        },
        {
            title: <StyledTitleWrapper>
                        <StyledIconButton>
                            <StyledFAIcon icon={faPencilRuler} />
                        </StyledIconButton>
                        <p>{strings.appGuide.modalContent.drawingTools.title}</p>
                    </StyledTitleWrapper>,
            content: <StyledGuideContent>
                        <p>{strings.appGuide.modalContent.drawingTools.content}</p>
                    </StyledGuideContent>
        },
        {
            title:  <StyledTitleWrapper>
                        <StyledIconButton>
                            <StyledFAIcon icon={faSave} />
                        </StyledIconButton>
                        <p>{strings.appGuide.modalContent.viewsAndGeometries.title}</p>
                    </StyledTitleWrapper>,
            content: <StyledGuideContent>
                        <p>{strings.appGuide.modalContent.viewsAndGeometries.content}</p>
                    </StyledGuideContent>
        },
        {
            title:  <StyledTitleWrapper>
                        <StyledIconButton>
                            <StyledFAIcon icon={faExpand} />
                        </StyledIconButton>
                        <p>{strings.appGuide.modalContent.setFullScreen.title}</p>
                    </StyledTitleWrapper>,
            content: <StyledGuideContent>
                        <p>{strings.appGuide.modalContent.setFullScreen.content}</p>
                    </StyledGuideContent>
        },
        {
            title:  <StyledTitleWrapper>
                        <StyledIconButton>
                            <StyledFAIcon icon={faSearch} />
                        </StyledIconButton>
                        <p>{strings.appGuide.modalContent.search.title}</p>
                    </StyledTitleWrapper> ,
            content: <StyledGuideContent>
                        <p>{strings.appGuide.modalContent.search.content}</p>
                    </StyledGuideContent>
        },
        {
            title:  <StyledTitleWrapper >
                        <StyledIconButton>
                            <StyledFAIcon icon={faList} />
                        </StyledIconButton>
                        <p>{strings.appGuide.modalContent.zoomBar.title}</p>
                    </StyledTitleWrapper>,
            content:<StyledGuideContent>
                        <p>{strings.appGuide.modalContent.zoomBar.content}</p>
                    </StyledGuideContent>
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
                                    {content.title}
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
