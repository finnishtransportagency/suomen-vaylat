import React from 'react';
import 'moment-timezone';
import moment from 'moment';
import strings from '../../../translations';
import { StyledParagraph, StyledTitle } from './Common';

export const CitationDate = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-dialog-citation-date'}>
            {identification.citation.date.date &&
                <React.Fragment key={'metadata-dialog-citation-date-content'}>
                    <StyledTitle>{strings.metadata.heading.citationDate}</StyledTitle>
                    <StyledParagraph title={(strings.metadata.codeLists['gmd:CI_DateTypeCode'][identification.citation.date.dateType] || { description: identification.citation.date.dateType }).description}>
                        <div>{moment(identification.citation.date.date).format('DD.MM.YYYY HH:mm').tz('Europe/Helsinki')}</div> ({(strings.metadata.codeLists['gmd:CI_DateTypeCode'][identification.citation.date.dateType] || { description: identification.citation.date.dateType }).label})
                    </StyledParagraph>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default CitationDate;