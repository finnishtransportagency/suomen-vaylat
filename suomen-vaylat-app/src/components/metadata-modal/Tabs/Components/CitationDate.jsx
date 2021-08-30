import strings from '../../../../translations';
import Moment from 'react-moment';
import 'moment-timezone';
import {StyledTitle, StyledUl, StyledParagraph} from './Common';

export const CitationDate = ({ identification }) => {
    return (
        <>
        {identification.citation.date.date &&
            <>
                <StyledTitle>{strings.metadata.heading.citationDate}</StyledTitle>
                <StyledUl>
                    <StyledParagraph title={(strings.metadata.codeLists['gmd:CI_DateTypeCode'][identification.citation.date.dateType] || {description: identification.citation.date.dateType}).description}>
                        <Moment format="DD.MM.YYYY" tz="Europe/Helsinki">{identification.citation.date.date}</Moment> ({(strings.metadata.codeLists['gmd:CI_DateTypeCode'][identification.citation.date.dateType] || {description: identification.citation.date.dateType}).label})
                    </StyledParagraph>
                </StyledUl>
            </>
        }
        </>
    );
};
export default CitationDate;