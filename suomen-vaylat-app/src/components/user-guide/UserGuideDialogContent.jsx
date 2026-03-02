import { useState, useMemo } from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { Accordion } from 'react-bootstrap';
import {
  faExpand,
  faLayerGroup,
  faSearch,
  faSave,
  faMapMarkedAlt,
  faDownload,
  faAngleRight,
  faList,
  faMap,
  faFilter,
  faRulerHorizontal,
  faShareAlt,
  faUpload,
  faObjectGroup
} from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as VaylaLogo } from '../layout/images/vayla_v_white.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserGuideUpperBarContent from './UserGuideUpperBarContent';
import UserGuideFilterContent from './UserGuideFilterContent';
import SearchBar from './UserGuideSearch';
import { theme } from '../../theme/theme';
import { IS_EXTRANET } from '../../utils/appInfoUtil';
import BuildIcon from '@mui/icons-material/Build';
import XYicon from '../coordinate-tool/resources/images/xy_icon.svg';
import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';

const StyledXYIcon = styled.img`
  height: 2em;
  @media ${(props) => props.theme.device.mobileL} {
    height: 1.7em;
  }
`;

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

// Extract all JSON-object values as one string
function extractStringsFromJson(obj) {
  let result = [];
  if (typeof obj === 'string') {
    result.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      result = result.concat(extractStringsFromJson(item));
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result = result.concat(extractStringsFromJson(obj[key]));
      }
    }
  }
  return result.join(' ');
}

export const UserGuideDialogContent = () => {
  const [dialogIndex, setDialogIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const setAccordionIndex = (index) => {
    dialogIndex === index ? setDialogIndex(null) : setDialogIndex(index);
  };

  const dialogContent = useMemo(() => {
    const base = [
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
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.upperBar).toLowerCase()
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
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.themeMenu).toLowerCase()
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
        content:  (
          <StyledGuideContent>
            <p>{strings.appGuide.dialogContent.mapLayerMenu.content.general}</p>
            <p>{strings.appGuide.dialogContent.mapLayerMenu.content.selectedLayers}</p>
            <p>{IS_EXTRANET ? strings.appGuide.dialogContent.mapLayerMenu.content.ownDatasets : strings.appGuide.dialogContent.mapLayerMenu.content.ownDatasetsExtranet}</p>
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.mapLayerMenu).toLowerCase()
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
          <StyledGuideContent style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
            {strings.appGuide.dialogContent.gfi.content.split('\n').map((c, i) => (
              <p key={`userguide_gfi_content_row_${i}`}> {c} </p>
            ))}
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.gfi).toLowerCase()
      },
      {
        title: (
          <StyledTitleWrapper>
            <StyledIconButton>
              <StyledFAIcon icon={faShareAlt} />
            </StyledIconButton>
            <p>{strings.appGuide.dialogContent.shareWebsite.title}</p>
          </StyledTitleWrapper>
        ),
        content: (
          <StyledGuideContent>
            <p>{strings.appGuide.dialogContent.shareWebsite.content}</p>
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.shareWebsite).toLowerCase()
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
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.filter).toLowerCase()
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
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.search).toLowerCase()
      },
      {
        title: (
          <StyledTitleWrapper>
            <StyledIconButton>
              <StyledXYIcon
                aria-label={strings.tooltips.coordinateTool + 'icon'}
                src={XYicon}
              />
            </StyledIconButton>
            <p>{strings.appGuide.dialogContent.coordinateTool.title}</p>
          </StyledTitleWrapper>
        ),
        content: (
          <StyledGuideContent>
            <p>{strings.appGuide.dialogContent.coordinateTool.content}</p>
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.coordinateTool).toLowerCase()
      },
      {
        title: (
          <StyledTitleWrapper>
            <StyledIconButton>
              <NavigationRoundedIcon style={{color: "white"}} />
            </StyledIconButton>
            <p>{strings.appGuide.dialogContent.location.title}</p>
          </StyledTitleWrapper>
        ),
        content: (
          <StyledGuideContent>
            <p>{strings.appGuide.dialogContent.location.content}</p>
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.location).toLowerCase()
      },
      {
        title: (
          <StyledTitleWrapper>
            <StyledIconButton>
              <ModeEditOutlineTwoToneIcon style={{color: "white"}} />
            </StyledIconButton>
            <p>{strings.appGuide.dialogContent.baseLayers.title}</p>
          </StyledTitleWrapper>
        ),
        content: (
          <StyledGuideContent>
            <p>{strings.appGuide.dialogContent.baseLayers.content}</p>
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.baseLayers).toLowerCase()
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
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.zoomBar).toLowerCase()
      },
      {
        title: (
          <StyledTitleWrapper>
            <StyledIconButton>
              <BuildIcon style={{color: "white"}} />
            </StyledIconButton>
            <p>{strings.appGuide.dialogContent.tools.title}</p>
          </StyledTitleWrapper>
        ),
        content: (
          <StyledGuideContent>
            <p>{strings.appGuide.dialogContent.tools.content}</p>
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.tools).toLowerCase()
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
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.downloads).toLowerCase()
      },
      {
        title: (
          <StyledTitleWrapper>
            <StyledIconButton>
              <StyledFAIcon icon={faObjectGroup} />
            </StyledIconButton>
            <p>{strings.appGuide.dialogContent.featureSelection.title}</p>
          </StyledTitleWrapper>
        ),
        content: (
          <StyledGuideContent>
            <p>{strings.appGuide.dialogContent.featureSelection.content}</p>
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.featureSelection).toLowerCase()
      },
      {
        title: (
          <StyledTitleWrapper>
            <StyledIconButton>
              <StyledFAIcon icon={faRulerHorizontal} />
            </StyledIconButton>
            <p>{strings.appGuide.dialogContent.drawingTools.title}</p>
          </StyledTitleWrapper>
        ),
        content: (
          <StyledGuideContent>
            <p>{strings.appGuide.dialogContent.drawingTools.content}</p>
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.drawingTools).toLowerCase()
      },
      {
        title: (
          <StyledTitleWrapper>
            <StyledIconButton>
              <StyledFAIcon icon={faSave} />
            </StyledIconButton>
            <p>{strings.appGuide.dialogContent.views.title}</p>
          </StyledTitleWrapper>
        ),
        content: (
          <StyledGuideContent>
            <p>{strings.appGuide.dialogContent.views.content}</p>
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.views).toLowerCase()
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
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.setFullScreen).toLowerCase()
      }
    ];

    if (IS_EXTRANET) {
      base.push({
        title: (
          <StyledTitleWrapper>
            <StyledIconButton>
              <StyledFAIcon icon={faUpload} />
            </StyledIconButton>
            <p>{strings.appGuide.dialogContent.datasetImport.title}</p>
          </StyledTitleWrapper>
        ),
        content: (
          <StyledGuideContent>
            <p>{strings.appGuide.dialogContent.datasetImport.content}</p>
          </StyledGuideContent>
        ),
        flatText: extractStringsFromJson(strings.appGuide.dialogContent.datasetImport).toLowerCase()
      });
    }

    return base;
  }, []);


  // Filtering logic
  const normalizedQuery = searchQuery.trim().replace(/\s+/g, ' ').toLowerCase();
  const filteredContent = dialogContent.filter(item =>
    item.flatText.includes(normalizedQuery)
  );

  return (
    <StyledContent
      id="user_guide_dialog_content"
      role="region"
      tabIndex="0"
    >
      <div style={{ marginBottom: '10px' }}>
        <SearchBar
          id="user_guide_search_bar"
          onSearch={query => setSearchQuery(query)}
        />
      </div>
      <StyledAccordion id="user_guide_dialog_accordion" activeKey={dialogIndex}>
        {filteredContent.length > 0 ? (
          filteredContent.map((content, index) => (
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
          ))
        ) : (
          <p>{strings.appGuide.noResults || 'No results found.'}</p>
        )}
      </StyledAccordion>
    </StyledContent>
  );
};

export default UserGuideDialogContent;
