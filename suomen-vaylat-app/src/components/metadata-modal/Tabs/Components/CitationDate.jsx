import React from 'react';
import strings from '../../../../translations';
import Moment from 'react-moment';
import 'moment-timezone';
import { StyledTitle, StyledUl, StyledParagraph } from './Common';

export const CitationDate = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-citation-date'}>
            {identification.citation.date.date &&
                <React.Fragment key={'metadata-modal-citation-date-content'}>
                    <StyledTitle>{strings.metadata.heading.citationDate}</StyledTitle>
                    <StyledParagraph title={(strings.metadata.codeLists['gmd:CI_DateTypeCode'][identification.citation.date.dateType] || { description: identification.citation.date.dateType }).description}>
                        <Moment format="DD.MM.YYYY" tz="Europe/Helsinki">{identification.citation.date.date}</Moment> ({(strings.metadata.codeLists['gmd:CI_DateTypeCode'][identification.citation.date.dateType] || { description: identification.citation.date.dateType }).label})
                    </StyledParagraph>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default CitationDate;