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
  faMap,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as VaylaLogo } from '../layout/images/vayla_v_white.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserGuideUpperBarContent from './UserGuideUpperBarContent';
import UserGuideFilterContent from './UserGuideFilterContent';
import { theme } from '../../theme/theme';

const StyledContent = styled.div`
  min-width: 600px;
  max-width: 600px;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow: auto;
  @media ${(props) => props.theme.device.mobileL} {
    min-width: initial;
  }
`;

const StyledAccordion = styled(Accordion)`
  display: flex;
  flex-direction: column;
`;

const StyledAccordionItem = styled(Accordion.Item)``;

const StyledAccordionButton = styled(Accordion.Button)`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 8px;
  p {
    margin: 0;
    margin-left: 8px;
    font-size: 18px;
  }
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

export const UserGuideDialogContent = () => {
  const [dialogIndex, setDialogIndex] = useState(null);

  const setAccordionIndex = (index) => {
    dialogIndex === index ? setDialogIndex(null) : setDialogIndex(index);
  };

  const dialogContent = [
    {
      title: (
        <StyledTitleWrapper>
          <StyledVaylaButton>
            <VaylaLogo />
          </StyledVaylaButton>
          <p>{strings.appGuide.dialogContent.upperBar.title}</p>
        </StyledTitleWrapper>
      ),
      content: (
        <StyledGuideContent>
          <UserGuideUpperBarContent />
        </StyledGuideContent>
      )
    },
    {
      title: (
        <StyledTitleWrapper>
          <StyledIconButton>
            <StyledFAIcon icon={faMap} />
          </StyledIconButton>
          <p>{strings.appGuide.dialogContent.themeMenu.title}</p>
        </StyledTitleWrapper>
      ),
      content: (
        <StyledGuideContent>
          <p>{strings.appGuide.dialogContent.themeMenu.content}</p>
        </StyledGuideContent>
      )
    },
    {
      title: (
        <StyledTitleWrapper>
          <StyledIconButton>
            <StyledFAIcon icon={faLayerGroup} />
          </StyledIconButton>
          <p>{strings.appGuide.dialogContent.mapLayerMenu.title}</p>
        </StyledTitleWrapper>
      ),
      content: <UserGuideTabs />
    },
    {
      title: (
        <StyledTitleWrapper>
          <StyledIconButton>
            <StyledFAIcon icon={faMapMarkedAlt} />
          </StyledIconButton>
          <p>{strings.gfi.title}</p>
        </StyledTitleWrapper>
      ),
      content: (
        <StyledGuideContent
          style={{ display: 'grid', gridTemplateColumns: '1fr' }}
        >
          {strings.appGuide.dialogContent.gfi.content
            .split('\n')
            .map((c, index) => {
              return <p key={`userguide_gfi_content_row_${index}`}> {c} </p>;
            })}
        </StyledGuideContent>
      )
    },
    {
      title: (
        <StyledTitleWrapper>
          <StyledIconButton>
            <StyledFAIcon icon={faFilter} />
          </StyledIconButton>
          <p>{strings.appGuide.dialogContent.filter.title}</p>
        </StyledTitleWrapper>
      ),
      content: (
        
        <StyledGuideContent>
          <UserGuideFilterContent />
        </StyledGuideContent>
      )
    },
    {
      title: (
        <StyledTitleWrapper>
          <StyledIconButton>
            <StyledFAIcon icon={faDownload} />
          </StyledIconButton>
          <p>{strings.downloads.downloads}</p>
        </StyledTitleWrapper>
      ),
      content: (
        <StyledGuideContent>
          <p>{strings.appGuide.dialogContent.downloads.content}</p>
        </StyledGuideContent>
      )
    },
    {
      title: (
        <StyledTitleWrapper>
          <StyledIconButton>
            <StyledFAIcon icon={faPencilRuler} />
          </StyledIconButton>
          <p>{strings.appGuide.dialogContent.drawingTools.title}</p>
        </StyledTitleWrapper>
      ),
      content: (
        <StyledGuideContent>
          <p>{strings.appGuide.dialogContent.drawingTools.content}</p>
        </StyledGuideContent>
      )
    },
    {
      title: (
        <StyledTitleWrapper>
          <StyledIconButton>
            <StyledFAIcon icon={faSave} />
          </StyledIconButton>
          <p>{strings.appGuide.dialogContent.viewsAndGeometries.title}</p>
        </StyledTitleWrapper>
      ),
      content: (
        <StyledGuideContent>
          <p>{strings.appGuide.dialogContent.viewsAndGeometries.content}</p>
        </StyledGuideContent>
      )
    },
    {
      title: (
        <StyledTitleWrapper>
          <StyledIconButton>
            <StyledFAIcon icon={faExpand} />
          </StyledIconButton>
          <p>{strings.appGuide.dialogContent.setFullScreen.title}</p>
        </StyledTitleWrapper>
      ),
      content: (
        <StyledGuideContent>
          <p>{strings.appGuide.dialogContent.setFullScreen.content}</p>
        </StyledGuideContent>
      )
    },
    {
      title: (
        <StyledTitleWrapper>
          <StyledIconButton>
            <StyledFAIcon icon={faSearch} />
          </StyledIconButton>
          <p>{strings.appGuide.dialogContent.search.title}</p>
        </StyledTitleWrapper>
      ),
      content: (
        <StyledGuideContent>
          <p>{strings.appGuide.dialogContent.search.content}</p>
        </StyledGuideContent>
      )
    },
    {
      title: (
        <StyledTitleWrapper>
          <StyledIconButton>
            <StyledFAIcon icon={faList} />
          </StyledIconButton>
          <p>{strings.appGuide.dialogContent.zoomBar.title}</p>
        </StyledTitleWrapper>
      ),
      content: (
        <StyledGuideContent>
          <p>{strings.appGuide.dialogContent.zoomBar.content}</p>
        </StyledGuideContent>
      )
    }
  ];

  return (
    <StyledContent
      id="user_guide_dialog_content"
      role="region"
      tabIndex="0" // Ensures the container is focusable
    >
      <StyledAccordion id="user_guide_dialog_accordion" activeKey={dialogIndex}>
        {dialogContent.map((content, index) => {
          return (
            <StyledAccordionItem
              eventKey={index}
              //bsPrefix={'user-guide-item'}
              key={'user_guide_dialog_content_accordion_' + index}
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
                    transform: dialogIndex === index && 'rotate(90deg)'
                  }}
                  icon={faAngleRight}
                />
                {content.title}
              </StyledAccordionButton>
              <StyledAccordionBody bsPrefix={'user-guide-body'}>
                {content.content}
              </StyledAccordionBody>
            </StyledAccordionItem>
          );
        })}
      </StyledAccordion>
    </StyledContent>
  );
};

export default UserGuideDialogContent;
